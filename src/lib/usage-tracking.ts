import { kv } from '@vercel/kv';

// Plan limits
export const PLAN_LIMITS = {
  free: {
    leads_per_month: 100,
    widget_views_per_month: 1000,
    api_calls_per_day: 1000,
  },
  starter: {
    leads_per_month: 1000,
    widget_views_per_month: 10000,
    api_calls_per_day: 10000,
  },
  growth: {
    leads_per_month: 10000,
    widget_views_per_month: 100000,
    api_calls_per_day: 100000,
  },
  enterprise: {
    leads_per_month: -1, // unlimited
    widget_views_per_month: -1,
    api_calls_per_day: -1,
  }
};

// Helper function to check if usage limit is exceeded
export async function checkUsageLimit(
  accountId: string, 
  limitType: 'leads' | 'widget_views' | 'api_calls',
  plan: string = 'free'
): Promise<{ allowed: boolean; limit: number; used: number }> {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentDay = now.toISOString().split('T')[0];
  
  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
  
  let key: string;
  let field: string;
  let limit: number;
  
  switch (limitType) {
    case 'leads':
      key = `usage:${accountId}:${currentMonth}`;
      field = 'leads';
      limit = limits.leads_per_month;
      break;
    case 'widget_views':
      key = `usage:${accountId}:${currentMonth}`;
      field = 'widget_views';
      limit = limits.widget_views_per_month;
      break;
    case 'api_calls':
      key = `usage:${accountId}:${currentDay}`;
      field = 'api_calls';
      limit = limits.api_calls_per_day;
      break;
  }
  
  // Unlimited check
  if (limit === -1) {
    return { allowed: true, limit: -1, used: 0 };
  }
  
  const used = await kv.hget(key, field) || 0;
  const allowed = Number(used) < limit;
  
  return { allowed, limit, used: Number(used) };
}

// Helper function to increment usage
export async function incrementUsage(
  accountId: string,
  usageType: 'leads' | 'widget_views' | 'api_calls'
): Promise<void> {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentDay = now.toISOString().split('T')[0];
  
  let key: string;
  let field: string;
  let ttl: number;
  
  switch (usageType) {
    case 'leads':
    case 'widget_views':
      key = `usage:${accountId}:${currentMonth}`;
      field = usageType;
      ttl = 60 * 60 * 24 * 31; // 31 days
      break;
    case 'api_calls':
      key = `usage:${accountId}:${currentDay}`;
      field = 'api_calls';
      ttl = 60 * 60 * 24 * 2; // 2 days
      break;
  }
  
  await kv.hincrby(key, field, 1);
  await kv.expire(key, ttl);
} 