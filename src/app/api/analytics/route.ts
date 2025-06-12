import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';
import { kv } from '@vercel/kv';

interface AnalyticsData {
  overview: {
    total_leads: number;
    qualified_leads: number;
    conversion_rate: number;
    average_score: number;
    total_widget_views: number;
    form_completion_rate: number;
  };
  trends: {
    daily: Array<{
      date: string;
      leads: number;
      qualified: number;
      widget_views: number;
    }>;
  };
  sources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  top_pages: Array<{
    page: string;
    views: number;
    conversions: number;
    conversion_rate: number;
  }>;
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
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (period) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default: // 7d
        startDate.setDate(startDate.getDate() - 7);
    }
    
    // Handle development mode
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Generate mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          total_leads: 127,
          qualified_leads: 89,
          conversion_rate: 70.1,
          average_score: 76.5,
          total_widget_views: 1847,
          form_completion_rate: 6.9,
        },
        trends: {
          daily: generateMockDailyData(period),
        },
        sources: [
          { source: 'Direct', count: 45, percentage: 35.4 },
          { source: 'Google', count: 38, percentage: 29.9 },
          { source: 'Social', count: 24, percentage: 18.9 },
          { source: 'Referral', count: 20, percentage: 15.8 },
        ],
        devices: [
          { device: 'Desktop', count: 78, percentage: 61.4 },
          { device: 'Mobile', count: 37, percentage: 29.1 },
          { device: 'Tablet', count: 12, percentage: 9.5 },
        ],
        top_pages: [
          { page: '/pricing', views: 523, conversions: 42, conversion_rate: 8.0 },
          { page: '/features', views: 412, conversions: 28, conversion_rate: 6.8 },
          { page: '/demo', views: 389, conversions: 35, conversion_rate: 9.0 },
          { page: '/', views: 345, conversions: 18, conversion_rate: 5.2 },
          { page: '/about', views: 178, conversions: 4, conversion_rate: 2.2 },
        ],
      };
      
      return NextResponse.json(mockData);
    }
    
    // Production: Fetch from Supabase and KV
    const supabase = await createClient();
    
    // Get overview metrics
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('account_id', accountId)
      .gte('created_at', startDate.toISOString());
    
    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw new Error('Failed to fetch analytics data');
    }
    
    const totalLeads = leads?.length || 0;
    const qualifiedLeads = leads?.filter(l => l.status === 'qualified').length || 0;
    const averageScore = leads?.reduce((sum, l) => sum + (l.score || 0), 0) / (totalLeads || 1);
    
    // Get widget views from KV cache
    let totalWidgetViews = 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayKey = date.toISOString().split('T')[0];
      
      const views = await kv.hget(`stats:${accountId}:${dayKey}`, 'widget_opened') || 0;
      totalWidgetViews += Number(views);
    }
    
    // Calculate daily trends
    const dailyTrends: AnalyticsData['trends']['daily'] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayStr = date.toISOString().split('T')[0];
      
      const dayLeads = leads?.filter(l => 
        l.created_at.startsWith(dayStr)
      ) || [];
      
      const dayKey = `stats:${accountId}:${dayStr}`;
      const widgetViews = await kv.hget(dayKey, 'widget_opened') || 0;
      
      dailyTrends.push({
        date: dayStr,
        leads: dayLeads.length,
        qualified: dayLeads.filter(l => l.status === 'qualified').length,
        widget_views: Number(widgetViews),
      });
    }
    
    // Get source and device data from metadata
    const sources: Record<string, number> = {};
    const devices: Record<string, number> = {};
    
    leads?.forEach(lead => {
      const source = lead.metadata?.referrer || 'Direct';
      sources[source] = (sources[source] || 0) + 1;
      
      const device = lead.metadata?.device || 'Desktop';
      devices[device] = (devices[device] || 0) + 1;
    });
    
    // Convert to arrays with percentages
    const sourcesArray = Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: (count / totalLeads) * 100,
    })).sort((a, b) => b.count - a.count);
    
    const devicesArray = Object.entries(devices).map(([device, count]) => ({
      device,
      count,
      percentage: (count / totalLeads) * 100,
    })).sort((a, b) => b.count - a.count);
    
    // Get top pages data
    const pages: Record<string, { views: number; conversions: number }> = {};
    
    // Aggregate page data from leads
    leads?.forEach(lead => {
      const page = new URL(lead.page_url || '').pathname;
      if (!pages[page]) {
        pages[page] = { views: 0, conversions: 0 };
      }
      pages[page].conversions++;
    });
    
    // Get page views from analytics
    const { data: pageViews } = await supabase
      .from('analytics')
      .select('page_url, metadata')
      .eq('account_id', accountId)
      .eq('event_type', 'widget_opened')
      .gte('created_at', startDate.toISOString());
    
    pageViews?.forEach(view => {
      const page = new URL(view.page_url || '').pathname;
      if (!pages[page]) {
        pages[page] = { views: 0, conversions: 0 };
      }
      pages[page].views++;
    });
    
    const topPagesArray = Object.entries(pages)
      .map(([page, data]) => ({
        page,
        views: data.views,
        conversions: data.conversions,
        conversion_rate: data.views > 0 ? (data.conversions / data.views) * 100 : 0,
      }))
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 5);
    
    const analyticsData: AnalyticsData = {
      overview: {
        total_leads: totalLeads,
        qualified_leads: qualifiedLeads,
        conversion_rate: totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0,
        average_score: Math.round(averageScore * 10) / 10,
        total_widget_views: totalWidgetViews,
        form_completion_rate: totalWidgetViews > 0 ? (totalLeads / totalWidgetViews) * 100 : 0,
      },
      trends: {
        daily: dailyTrends,
      },
      sources: sourcesArray,
      devices: devicesArray,
      top_pages: topPagesArray,
    };
    
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate mock daily data
function generateMockDailyData(period: string): AnalyticsData['trends']['daily'] {
  const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      leads: Math.floor(Math.random() * 20) + 5,
      qualified: Math.floor(Math.random() * 15) + 3,
      widget_views: Math.floor(Math.random() * 200) + 100,
    });
  }
  
  return data;
} 