import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-auth';
import { headers } from 'next/headers';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Received Stripe webhook:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log('Processing checkout session completed:', session.id);
  
  const accountId = session.metadata?.account_id;
  const plan = session.metadata?.plan;
  
  if (!accountId || !plan) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Update account with subscription info
  const supabase = await createClient();
  await supabase
    .from('accounts')
    .update({
      plan: plan,
      stripe_subscription_id: session.subscription,
      updated_at: new Date().toISOString()
    })
    .eq('id', accountId);

  console.log(`Updated account ${accountId} to ${plan} plan`);
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Processing subscription updated:', subscription.id);
  
  const customerId = subscription.customer;
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  
  // Determine plan from price ID
  let plan = 'free';
  if (subscription.items?.data?.[0]?.price?.id) {
    const priceId = subscription.items.data[0].price.id;
    if (priceId === process.env.STRIPE_PRICE_GROWTH) {
      plan = 'growth';
    } else if (priceId === process.env.STRIPE_PRICE_SCALE) {
      plan = 'scale';
    }
  }

  // Update account based on subscription status
  const updateData: any = {
    stripe_subscription_id: subscription.id,
    updated_at: new Date().toISOString()
  };

  if (status === 'active') {
    updateData.plan = plan;
  } else if (status === 'canceled' || status === 'unpaid') {
    updateData.plan = 'free';
  }

  const supabase = await createClient();
  await supabase
    .from('accounts')
    .update(updateData)
    .eq('stripe_customer_id', customerId);

  console.log(`Updated subscription for customer ${customerId}: ${status}, plan: ${plan}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Processing subscription deleted:', subscription.id);
  
  const customerId = subscription.customer;
  
  // Downgrade account to free plan
  const supabase = await createClient();
  await supabase
    .from('accounts')
    .update({
      plan: 'free',
      stripe_subscription_id: null,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId);

  console.log(`Downgraded account to free plan for customer ${customerId}`);
}

async function handlePaymentSucceeded(invoice: any) {
  console.log('Processing payment succeeded:', invoice.id);
  
  // Could add analytics tracking here for successful payments
  // For now, subscription updates are handled by subscription.updated events
}

async function handlePaymentFailed(invoice: any) {
  console.log('Processing payment failed:', invoice.id);
  
  // Could add alerting or grace period logic here
  // Stripe typically handles retry logic automatically
} 