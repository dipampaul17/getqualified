import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase-auth';
import { cn } from '@/lib/utils';

export async function DashboardMetrics({ accountId }: { accountId: string }) {
  // Check if we're in development mode without Supabase
  const isDevMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  
  if (isDevMode) {
    // Mock data for development
    return <DashboardMetricsContent 
      impressions={150}
      conversions={12}
      widgetConversions={8}
      lift={42}
      activeInstalls={1}
    />;
  }

  const client = await createClient();
  
  // Get conversion data for A/B test (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: impressions } = await client
    .from('analytics')
    .select('variant')
    .eq('account_id', accountId)
    .eq('event_type', 'impression')
    .gte('created_at', sevenDaysAgo);
    
  const { data: conversions } = await client
    .from('responses')
    .select('id, qualified')
    .eq('account_id', accountId)
    .gte('created_at', sevenDaysAgo);
    
  // Calculate metrics
  const widgetImpressions = impressions?.filter(i => i.variant === 'widget').length || 0;
  const controlImpressions = impressions?.filter(i => i.variant === 'control').length || 0;
  const totalImpressions = widgetImpressions + controlImpressions;
  const widgetConversions = conversions?.filter(c => c.qualified).length || 0;
  const totalConversions = conversions?.length || 0;
  
  // Calculate conversion rates
  const widgetRate = widgetImpressions > 0 ? (widgetConversions / widgetImpressions) * 100 : 0;
  const controlRate = 2.3; // Baseline form conversion rate
  const lift = controlRate > 0 ? ((widgetRate - controlRate) / controlRate) * 100 : 0;
  
  // Active installs (sites with impressions in last 24h)
  const yesterdayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentImpressions } = await client
    .from('analytics')
    .select('page_url')
    .eq('account_id', accountId)
    .eq('event_type', 'impression')
    .gte('created_at', yesterdayAgo);
    
  const uniqueUrls = new Set(recentImpressions?.map(i => new URL(i.page_url).hostname) || []);
  const activeInstalls = uniqueUrls.size;
  
  return <DashboardMetricsContent 
    impressions={totalImpressions}
    conversions={totalConversions}
    widgetConversions={widgetConversions}
    lift={lift}
    activeInstalls={activeInstalls}
  />;
}

function DashboardMetricsContent({ 
  impressions, 
  conversions, 
  widgetConversions, 
  lift, 
  activeInstalls 
}: {
  impressions: number;
  conversions: number;
  widgetConversions: number;
  lift: number;
  activeInstalls: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Conversion Lift"
        value={lift > 0 ? `+${lift.toFixed(0)}%` : `${lift.toFixed(0)}%`}
        subtitle="vs. standard forms"
        highlight={lift > 15}
        description="Measured against 2.3% baseline"
      />
      
      <MetricCard
        title="Qualified Leads"
        value={widgetConversions.toString()}
        subtitle="past 7 days"
        description={`${conversions} total responses`}
      />
      
      <MetricCard
        title="Active Installs"
        value={activeInstalls.toString()}
        subtitle="websites using widget"
        description={impressions > 0 ? `${impressions} total impressions` : "Add widget to your site"}
      />
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  description, 
  highlight = false 
}: {
  title: string;
  value: string;
  subtitle: string;
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-white p-6 transition-all duration-200",
      highlight 
        ? "border-2 border-green-500 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30" 
        : "border border-zinc-200 shadow-sm hover:shadow-md"
    )}>
      {highlight && (
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 blur-2xl" />
      )}
      <div className="relative">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-600">{title}</h3>
          {highlight && (
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <p className={cn(
          "text-3xl font-bold mt-2 tracking-tight",
          highlight ? "text-green-600" : "text-zinc-900"
        )}>
          {value}
        </p>
        <p className="text-sm text-zinc-600 mt-1">{subtitle}</p>
        {description && (
          <p className="text-xs text-zinc-500 mt-2">{description}</p>
        )}
        {highlight && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
            <span>🎉</span>
            <span>Significant improvement!</span>
          </div>
        )}
      </div>
    </div>
  );
} 