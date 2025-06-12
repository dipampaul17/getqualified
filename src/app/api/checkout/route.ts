import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();
    
    // Check if we're in development mode
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Mock checkout URL for development
      return Response.json({ 
        url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true&plan=${plan}&mock=true` 
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
    
    // Get or create Stripe customer
    let customerId = account.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: account.company_name,
        metadata: {
          account_id: account.id
        }
      });
      
      customerId = customer.id;
      
      // Update account with customer ID
      await supabase
        .from('accounts')
        .update({ stripe_customer_id: customerId })
        .eq('id', account.id);
    }
    
    // Validate plan and get price ID
    const prices = {
      growth: process.env.STRIPE_PRICE_GROWTH,
      scale: process.env.STRIPE_PRICE_SCALE
    };
    
    const priceId = prices[plan as keyof typeof prices];
    if (!priceId) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }
    
    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        account_id: account.id,
        plan: plan
      },
      subscription_data: {
        metadata: {
          account_id: account.id,
          plan: plan
        }
      }
    });
    
    return Response.json({ url: checkoutSession.url });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to create checkout session' 
    }, { status: 500 });
  }
} 