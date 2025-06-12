import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in development mode
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Mock billing portal URL for development
      return Response.json({ 
        url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=mock` 
      });
    }

    const supabase = await createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get account
    const { data: account } = await supabase
      .from('accounts')
      .select('*')
      .eq('email', session.user.email)
      .single();
      
    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    if (!account.stripe_customer_id) {
      return Response.json({ error: 'No billing account found' }, { status: 404 });
    }
    
    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: account.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });
    
    return Response.json({ url: portalSession.url });
    
  } catch (error) {
    console.error('Billing portal error:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to create billing portal session' 
    }, { status: 500 });
  }
} 