import { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import { SCORING } from '@/lib/constants';
import OpenAI from 'openai';
import { triggerWebhooks } from '@/lib/webhook-utils';
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracking';
import { sendEmail, generateQualifiedLeadEmail } from '@/lib/email';
import { createClient } from '@/lib/supabase-auth';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface Account {
  id: string;
  email: string;
  company_name: string;
  api_key: string;
  plan: string;
  industry?: string;
}

interface Answer {
  questionId: string;
  question: string;
  answer: string;
  timestamp: string;
  timeToAnswer?: number;
}

interface DeviceInfo {
  type: string;
  os: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  viewport: {
    width: number;
    height: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { 
      apiKey, 
      visitorId, 
      sessionId, 
      pageUrl, 
      pageTitle,
      answers,
      device,
      totalTime,
      timestamp
    } = await request.json();
    
    // Create supabase client
    const supabase = await createClient();
    
    // Check if we're in development with placeholder values
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Mock response for development
      const mockScore = Math.random() * 0.4 + 0.6; // Random score between 0.6-1.0
      return Response.json({
        qualified: mockScore >= 0.7,
        score: mockScore,
        calendlyUrl: mockScore >= 0.7 ? 'https://calendly.com/demo' : null,
        responseId: 'dev-response-id'
      });
    }
    
    // Validate API key from cache
    const cachedAccount = await kv.get(`account:${apiKey}`) as Account | null;
    let account = cachedAccount;
    
    if (!account) {
      // Fetch from database
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('api_key', apiKey)
        .single();
        
      if (error || !data) {
        return Response.json({ error: 'Invalid API key' }, { status: 401 });
      }
      
      account = data as Account;
      await kv.set(`account:${apiKey}`, account, { ex: 300 });
    }
    
    // Check usage limits
    const { allowed, limit, used } = await checkUsageLimit(account.id, 'leads', account.plan);
    if (!allowed) {
      return Response.json({ 
        error: 'Lead limit exceeded', 
        limit, 
        used,
        upgrade_url: '/pricing' 
      }, { status: 429 });
    }
    
    // Generate AI qualification score
    const score = await generateQualificationScore(answers, account.industry || 'saas', device);
    const qualified = score >= SCORING.QUALIFIED_THRESHOLD;
    
    // Calculate engagement metrics
    const avgTimePerQuestion = totalTime / answers.length;
    const engagementScore = calculateEngagementScore(answers, totalTime);
    
    // Save response to database with enhanced data
    const { data: response, error } = await supabase
      .from('responses')
      .insert({
        account_id: account.id,
        visitor_id: visitorId,
        page_url: pageUrl,
        page_title: pageTitle,
        questions: answers.map((a: Answer) => ({ id: a.questionId, text: a.question })),
        answers: answers.map((a: Answer) => ({ 
          id: a.questionId, 
          text: a.answer,
          timeToAnswer: a.timeToAnswer || null
        })),
        score: score,
        qualified: qualified,
        metadata: {
          session_id: sessionId,
          user_agent: request.headers.get('user-agent'),
          device: device,
          timestamp: timestamp || new Date().toISOString(),
          totalTime: totalTime,
          avgTimePerQuestion: avgTimePerQuestion,
          engagementScore: engagementScore,
          referrer: request.headers.get('referer')
        }
      })
      .select()
      .single();
    
    if (error) {
      console.error('Failed to save response:', error);
      return Response.json({ error: 'Failed to save response' }, { status: 500 });
    }
    
    // Track conversion event with device info
    await supabase.from('analytics').insert({
      account_id: account.id,
      event_type: qualified ? 'qualified_lead' : 'unqualified_lead',
      visitor_id: visitorId,
      page_url: pageUrl,
      metadata: {
        session_id: sessionId,
        score: score,
        response_id: response.id,
        device_type: device?.type || 'unknown',
        browser: device?.browser || 'unknown',
        os: device?.os || 'unknown',
        viewport_width: device?.viewport?.width,
        viewport_height: device?.viewport?.height,
        engagement_score: engagementScore
      }
    });
    
    // Update account usage metrics
    await updateAccountUsage(account.id, supabase);
    await incrementUsage(account.id, 'leads');
    
    // Trigger webhooks
    const leadData = {
      id: response.id,
      company_name: answers.find((a: Answer) => a.questionId === 'company')?.answer || 'Unknown',
      contact_name: answers.find((a: Answer) => a.questionId === 'name')?.answer || 'Unknown',
      email: answers.find((a: Answer) => a.questionId === 'email')?.answer || visitorId,
      score: score,
      status: qualified ? 'qualified' : 'not_qualified',
      responses: answers.reduce((acc: Record<string, string>, a: Answer) => ({ ...acc, [a.questionId]: a.answer }), {}),
      metadata: {
        page_url: pageUrl,
        device: device?.type,
        browser: device?.browser,
        session_duration: totalTime,
        engagement_score: engagementScore,
      }
    };
    
    await triggerWebhooks(account.id, 'lead.created', leadData);
    if (qualified) {
      await triggerWebhooks(account.id, 'lead.qualified', leadData);
    }
    
    // Get calendar booking URL if qualified (for demo purposes)
    let calendlyUrl = null;
    if (qualified && account.plan !== 'free') {
      calendlyUrl = `https://calendly.com/demo-${account.id}`;
    }
    
    // Set CORS headers for cross-origin requests
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    
    return new Response(JSON.stringify({
      qualified,
      score,
      calendlyUrl,
      responseId: response.id
    }), { headers: responseHeaders });
    
  } catch (error) {
    console.error('Widget submit error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

async function generateQualificationScore(
  answers: Answer[], 
  industry: string,
  device: DeviceInfo
): Promise<number> {
  try {
    // Prepare context for AI scoring
    const context = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n');
    
    const prompt = `You are an expert sales qualification AI for the ${industry} industry. 
    
    Score this lead from 0.0 to 1.0 based on their responses below. Consider:
    - Intent/urgency (40% weight)
    - Budget/authority (30% weight) 
    - Timeline (20% weight)
    - Company fit (10% weight)
    
    Additional context:
    - Device: ${device?.type || 'unknown'}
    - Response time indicates ${answers[0]?.timeToAnswer && answers[0].timeToAnswer < 5000 ? 'high' : 'normal'} engagement
    
    Respond with only a number between 0.0 and 1.0.
    
    Lead responses:
    ${context}`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0.1,
    });
    
    const scoreText = completion.choices[0]?.message?.content?.trim();
    const score = parseFloat(scoreText || '0');
    
    // Validate score is between 0 and 1
    if (isNaN(score) || score < 0 || score > 1) {
      console.warn('Invalid AI score, falling back to rule-based scoring');
      return calculateRuleBasedScore(answers);
    }
    
    return score;
    
  } catch (error) {
    console.error('AI scoring failed, using rule-based fallback:', error);
    return calculateRuleBasedScore(answers);
  }
}

function calculateRuleBasedScore(answers: Answer[]): number {
  let score = 0;
  const totalQuestions = answers.length;
  
  if (totalQuestions === 0) return 0;
  
  answers.forEach(answer => {
    const text = answer.answer.toLowerCase();
    let questionScore = 0.5; // Base score
    
    // Intent indicators
    if (text.includes('urgent') || text.includes('asap') || text.includes('immediately')) {
      questionScore += 0.3;
    }
    if (text.includes('exploring') || text.includes('research') || text.includes('maybe')) {
      questionScore -= 0.2;
    }
    
    // Budget indicators
    if (text.includes('budget') || text.includes('approved') || text.includes('allocated')) {
      questionScore += 0.2;
    }
    
    // Timeline indicators
    if (text.includes('this month') || text.includes('next month')) {
      questionScore += 0.2;
    }
    if (text.includes('next year') || text.includes('someday')) {
      questionScore -= 0.1;
    }
    
    // Company size indicators
    if (text.match(/\d+/) && parseInt(text.match(/\d+/)![0]) > 10) {
      questionScore += 0.1;
    }
    
    // Engagement indicators (quick responses = higher intent)
    if (answer.timeToAnswer && answer.timeToAnswer < 3000) {
      questionScore += 0.1;
    }
    
    score += Math.max(0, Math.min(1, questionScore));
  });
  
  return Math.max(0, Math.min(1, score / totalQuestions));
}

function calculateEngagementScore(answers: Answer[], totalTime: number): number {
  // Calculate engagement based on response quality and time
  let score = 0;
  
  // Average words per answer
  const avgWords = answers.reduce((sum, a) => sum + a.answer.split(' ').length, 0) / answers.length;
  if (avgWords > 10) score += 0.3;
  if (avgWords > 20) score += 0.2;
  
  // Response time (faster is better, but not too fast)
  const avgTime = totalTime / answers.length;
  if (avgTime > 5000 && avgTime < 30000) score += 0.3;
  
  // Completion rate (they answered all questions)
  score += 0.2;
  
  return Math.min(1, score);
}

async function updateAccountUsage(accountId: string, supabase: any) {
  try {
    // Increment response count for the current month
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    await supabase.rpc('increment_usage', {
      p_account_id: accountId,
      p_month: monthKey,
      p_count: 1
    });
  } catch (error) {
    console.error('Failed to update usage:', error);
  }
} 