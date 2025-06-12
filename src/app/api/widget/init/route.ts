import { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import { createClient } from '@/lib/supabase-auth';

export const runtime = 'edge';

interface Account {
  id: string;
  email: string;
  company_name: string;
  api_key: string;
  secret_key: string;
  plan: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, visitorId, pageUrl } = await request.json();
    
    // Check if we're in development with placeholder values
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return Response.json({
        showWidget: true,
        questions: getQuestionsForIndustry('saas'),
        accountId: 'dev-account-id'
      });
    }
    
    // Validate API key from cache first
    const cachedAccount = await kv.get(`account:${apiKey}`) as Account | null;
    let account = cachedAccount;
    
    if (!account) {
      // Fetch from database
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('api_key', apiKey)
        .single();
        
      if (error || !data) {
        return Response.json({ error: 'Invalid API key' }, { status: 401 });
      }
      
      account = data as Account;
      // Cache for 5 minutes
      await kv.set(`account:${apiKey}`, account, { ex: 300 });
    }
    
    // A/B test assignment (deterministic based on visitor ID)
    const hash = simpleHash(visitorId);
    const showWidget = hash % 100 < 50;
    
    // Track impression (skip in development)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const supabase = await createClient();
      await supabase.from('analytics').insert({
        account_id: account.id,
        event_type: 'impression',
        visitor_id: visitorId,
        variant: showWidget ? 'widget' : 'control',
        page_url: pageUrl,
        metadata: { referrer: request.headers.get('referer') }
      });
    }
    
    // Get questions based on industry
    const questions = getQuestionsForIndustry(account.industry || 'saas');
    
    return Response.json({
      showWidget,
      questions,
      accountId: account.id
    });
    
  } catch (error) {
    console.error('Widget init error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

function getQuestionsForIndustry(industry: string) {
  const templates: { [key: string]: Array<{ id: string; text: string }> } = {
    saas: [
      { id: 'use_case', text: 'What specific challenge are you looking to solve?' },
      { id: 'timeline', text: 'When do you need a solution in place?' },
      { id: 'decision', text: 'Who else is involved in this decision?' }
    ],
    ecommerce: [
      { id: 'volume', text: 'How many orders do you process monthly?' },
      { id: 'platform', text: 'What platform are you currently using?' },
      { id: 'pain', text: 'What\'s your biggest operational challenge?' }
    ],
    default: [
      { id: 'intent', text: 'What brings you here today?' },
      { id: 'timeline', text: 'What\'s your timeline for making a change?' },
      { id: 'budget', text: 'Have you allocated budget for this initiative?' }
    ]
  };
  
  return templates[industry] || templates.default;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
} 