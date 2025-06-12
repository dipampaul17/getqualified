import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';
import { kv } from '@vercel/kv';
import { PLAN_LIMITS } from '@/lib/usage-tracking';

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
    
    // Get account plan
    let plan = 'free';
    
    if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const supabase = await createClient();
      const { data: account } = await supabase
        .from('accounts')
        .select('plan')
        .eq('id', accountId)
        .single();
      
      plan = account?.plan || 'free';
    }
    
    // Calculate current month and day
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentDay = now.toISOString().split('T')[0];
    
    // Get usage from cache
    const monthKey = `usage:${accountId}:${currentMonth}`;
    const dayKey = `usage:${accountId}:${currentDay}`;
    
    // Get monthly usage
    const monthlyLeads = await kv.hget(monthKey, 'leads') || 0;
    const monthlyWidgetViews = await kv.hget(monthKey, 'widget_views') || 0;
    
    // Get daily usage
    const dailyApiCalls = await kv.hget(dayKey, 'api_calls') || 0;
    
    // Get limits for the plan
    const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
    
    // Calculate usage percentages
    const usage = {
      leads: {
        used: Number(monthlyLeads),
        limit: limits.leads_per_month,
        percentage: limits.leads_per_month === -1 ? 0 : (Number(monthlyLeads) / limits.leads_per_month) * 100,
        remaining: limits.leads_per_month === -1 ? -1 : Math.max(0, limits.leads_per_month - Number(monthlyLeads)),
      },
      widget_views: {
        used: Number(monthlyWidgetViews),
        limit: limits.widget_views_per_month,
        percentage: limits.widget_views_per_month === -1 ? 0 : (Number(monthlyWidgetViews) / limits.widget_views_per_month) * 100,
        remaining: limits.widget_views_per_month === -1 ? -1 : Math.max(0, limits.widget_views_per_month - Number(monthlyWidgetViews)),
      },
      api_calls: {
        used: Number(dailyApiCalls),
        limit: limits.api_calls_per_day,
        percentage: limits.api_calls_per_day === -1 ? 0 : (Number(dailyApiCalls) / limits.api_calls_per_day) * 100,
        remaining: limits.api_calls_per_day === -1 ? -1 : Math.max(0, limits.api_calls_per_day - Number(dailyApiCalls)),
      },
    };
    
    // Check if any limits are exceeded
    const limitsExceeded = {
      leads: limits.leads_per_month !== -1 && Number(monthlyLeads) >= limits.leads_per_month,
      widget_views: limits.widget_views_per_month !== -1 && Number(monthlyWidgetViews) >= limits.widget_views_per_month,
      api_calls: limits.api_calls_per_day !== -1 && Number(dailyApiCalls) >= limits.api_calls_per_day,
    };
    
    return NextResponse.json({
      plan,
      usage,
      limits_exceeded: limitsExceeded,
      period: {
        month: currentMonth,
        day: currentDay,
      },
      upgrade_available: plan !== 'enterprise',
    });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

 