import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';

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
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    // Handle development mode
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Generate mock CSV data
      const mockLeads = [
        {
          company_name: 'Acme Corp',
          contact_name: 'John Doe',
          email: 'john@acme.com',
          website: 'acme.com',
          score: 95,
          status: 'qualified',
          created_at: new Date().toISOString(),
          company_size: '50-200',
          budget: '$10k-50k',
          timeline: 'This quarter',
          use_case: 'Lead qualification automation',
          browser: 'Chrome',
          device: 'Desktop',
          location: 'San Francisco, CA'
        },
        {
          company_name: 'TechStartup Inc',
          contact_name: 'Jane Smith',
          email: 'jane@techstartup.com',
          website: 'techstartup.com',
          score: 72,
          status: 'qualified',
          created_at: new Date().toISOString(),
          company_size: '10-50',
          budget: '$5k-10k',
          timeline: 'Next month',
          use_case: 'Improve conversion rates',
          browser: 'Safari',
          device: 'Mobile',
          location: 'New York, NY'
        }
      ];
      
      const csv = generateCSV(mockLeads);
      
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }
    
    // Production: Fetch from Supabase
    const supabase = await createClient();
    
    // Build query
    let query = supabase
      .from('leads')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data: leads, error } = await query;
    
    if (error) {
      console.error('Error fetching leads for export:', error);
      return NextResponse.json({ error: 'Failed to export leads' }, { status: 500 });
    }
    
    // Transform leads data for CSV
    const csvData = leads?.map(lead => ({
      company_name: lead.company_name || '',
      contact_name: lead.contact_name || '',
      email: lead.email || '',
      website: lead.website || '',
      score: lead.score || 0,
      status: lead.status || '',
      created_at: lead.created_at || '',
      ...Object.entries(lead.responses || {}).reduce((acc, [key, value]) => ({
        ...acc,
        [key.replace(/_/g, ' ')]: value
      }), {}),
      browser: lead.metadata?.browser || '',
      device: lead.metadata?.device || '',
      location: lead.metadata?.location || ''
    })) || [];
    
    const csv = generateCSV(csvData);
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Lead export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  // Get all unique headers from all objects
  const headers = new Set<string>();
  data.forEach(row => {
    Object.keys(row).forEach(key => headers.add(key));
  });
  
  // Convert headers to array and sort them
  const headerArray = Array.from(headers).sort((a, b) => {
    // Put main fields first
    const priority = ['company_name', 'contact_name', 'email', 'score', 'status', 'created_at'];
    const aIndex = priority.indexOf(a);
    const bIndex = priority.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    return a.localeCompare(b);
  });
  
  // Create CSV header row
  const csvHeader = headerArray.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  
  // Create CSV data rows
  const csvRows = data.map(row => 
    headerArray.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma, newline, or quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );
  
  return [csvHeader, ...csvRows].join('\n');
} 