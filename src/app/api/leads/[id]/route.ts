import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';

interface LeadDetail {
  id: string;
  account_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  website: string;
  score: number;
  status: 'qualified' | 'not_qualified' | 'pending';
  created_at: string;
  responses: Record<string, any>;
  metadata?: {
    browser?: string;
    device?: string;
    location?: string;
    ip_address?: string;
    user_agent?: string;
    session_duration?: number;
    pages_viewed?: number;
  };
  conversation?: Array<{
    question: string;
    answer: string;
    timestamp: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accountId = session.accountId;
    const { id: leadId } = await params;
    
    // Handle development mode
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Return mock lead detail
      const mockLead: LeadDetail = {
        id: leadId,
        account_id: accountId,
        company_name: 'Acme Corp',
        contact_name: 'John Doe',
        email: 'john@acme.com',
        website: 'https://acme.com',
        score: 95,
        status: 'qualified',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        responses: {
          company_size: '50-200',
          budget: '$10k-50k',
          timeline: 'This quarter',
          use_case: 'Lead qualification automation',
          pain_points: 'Manual lead scoring, slow response times',
          decision_maker: 'Yes',
          existing_solution: 'HubSpot',
        },
        metadata: {
          browser: 'Chrome 120.0',
          device: 'Desktop',
          location: 'San Francisco, CA',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          session_duration: 245,
          pages_viewed: 5,
        },
        conversation: [
          {
            question: "What's your company size?",
            answer: "50-200 employees",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 240000).toISOString()
          },
          {
            question: "What's your budget for this solution?",
            answer: "$10k-50k",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 180000).toISOString()
          },
          {
            question: "When are you looking to implement?",
            answer: "This quarter",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 120000).toISOString()
          },
          {
            question: "What's your primary use case?",
            answer: "Lead qualification automation",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 60000).toISOString()
          }
        ]
      };
      
      return NextResponse.json(mockLead);
    }
    
    // Production: Fetch from Supabase
    const supabase = await createClient();
    
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('account_id', accountId)
      .single();
    
    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Lead detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 