import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';

interface Lead {
  id: string;
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
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accountId = session.accountId;
    
    // Handle development mode
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Return mock data for development
      const mockLeads: Lead[] = [
        {
          id: '1',
          company_name: 'Acme Corp',
          contact_name: 'John Doe',
          email: 'john@acme.com',
          website: 'acme.com',
          score: 95,
          status: 'qualified',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          responses: {
            company_size: '50-200',
            budget: '$10k-50k',
            timeline: 'This quarter',
            use_case: 'Lead qualification automation'
          },
          metadata: {
            browser: 'Chrome',
            device: 'Desktop',
            location: 'San Francisco, CA'
          }
        },
        {
          id: '2',
          company_name: 'TechStartup Inc',
          contact_name: 'Jane Smith',
          email: 'jane@techstartup.com',
          website: 'techstartup.com',
          score: 72,
          status: 'qualified',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          responses: {
            company_size: '10-50',
            budget: '$5k-10k',
            timeline: 'Next month',
            use_case: 'Improve conversion rates'
          },
          metadata: {
            browser: 'Safari',
            device: 'Mobile',
            location: 'New York, NY'
          }
        },
        {
          id: '3',
          company_name: 'Small Biz LLC',
          contact_name: 'Bob Wilson',
          email: 'bob@smallbiz.com',
          website: 'smallbiz.com',
          score: 45,
          status: 'not_qualified',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          responses: {
            company_size: '1-10',
            budget: 'Under $1k',
            timeline: 'Just browsing',
            use_case: 'Not sure yet'
          },
          metadata: {
            browser: 'Firefox',
            device: 'Desktop',
            location: 'Austin, TX'
          }
        }
      ];
      
      // Simulate empty state for new accounts
      const isNewAccount = session.createdAt && (Date.now() - session.createdAt) < 60000; // Less than 1 minute old
      
      return NextResponse.json({
        leads: isNewAccount ? [] : mockLeads,
        total: isNewAccount ? 0 : mockLeads.length,
        has_more: false
      });
    }
    
    // Production: Fetch from Supabase
    const supabase = await createClient();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Build query
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    
    const { data: leads, error, count } = await query;
    
    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
    
    return NextResponse.json({
      leads: leads || [],
      total: count || 0,
      has_more: (count || 0) > offset + limit,
      page,
      limit
    });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 