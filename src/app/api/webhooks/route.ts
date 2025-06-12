import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';
import { kv } from '@vercel/kv';

interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  created_at: string;
  last_triggered?: string;
  failure_count: number;
}

type WebhookEvent = 'lead.created' | 'lead.qualified' | 'lead.updated' | 'widget.installed';

// Helper function to generate random string
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Helper function to create HMAC signature
async function createHmacSignature(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataBytes = encoder.encode(data);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, dataBytes);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
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
    
    // Get webhooks from cache/database
    const webhooks = await kv.get(`webhooks:${accountId}`) || [];
    
    return NextResponse.json({
      webhooks: webhooks as Webhook[],
      available_events: [
        { event: 'lead.created', description: 'Triggered when a new lead is captured' },
        { event: 'lead.qualified', description: 'Triggered when a lead is marked as qualified' },
        { event: 'lead.updated', description: 'Triggered when lead information is updated' },
        { event: 'widget.installed', description: 'Triggered when widget is verified on a new domain' },
      ],
    });
  } catch (error) {
    console.error('Get webhooks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accountId = session.accountId;
    
    // Get webhook data from request
    const { url, events } = await request.json();
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid webhook URL' }, { status: 400 });
    }
    
    // Validate events
    const validEvents: WebhookEvent[] = ['lead.created', 'lead.qualified', 'lead.updated', 'widget.installed'];
    const invalidEvents = events.filter((e: string) => !validEvents.includes(e as WebhookEvent));
    if (invalidEvents.length > 0) {
      return NextResponse.json({ 
        error: `Invalid events: ${invalidEvents.join(', ')}` 
      }, { status: 400 });
    }
    
    // Generate webhook secret
    const secret = 'whsec_' + generateRandomString(24);
    
    // Create webhook
    const webhook: Webhook = {
      id: crypto.randomUUID(),
      url,
      events,
      secret,
      active: true,
      created_at: new Date().toISOString(),
      failure_count: 0,
    };
    
    // Get existing webhooks
    const existingWebhooks = (await kv.get(`webhooks:${accountId}`) || []) as Webhook[];
    
    // Add new webhook
    const updatedWebhooks = [...existingWebhooks, webhook];
    
    // Save to cache
    await kv.set(`webhooks:${accountId}`, updatedWebhooks);
    
    // Test the webhook with a verification event
    testWebhook(webhook, {
      event: 'webhook.test',
      data: {
        message: 'Webhook successfully configured',
        timestamp: new Date().toISOString(),
      },
    });
    
    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        secret: webhook.secret,
      },
      message: 'Webhook created successfully. A test event has been sent.',
    });
  } catch (error) {
    console.error('Create webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accountId = session.accountId;
    
    // Get webhook ID from query params
    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get('id');
    
    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 });
    }
    
    // Get existing webhooks
    const existingWebhooks = (await kv.get(`webhooks:${accountId}`) || []) as Webhook[];
    
    // Filter out the webhook to delete
    const updatedWebhooks = existingWebhooks.filter(w => w.id !== webhookId);
    
    if (existingWebhooks.length === updatedWebhooks.length) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }
    
    // Save updated webhooks
    await kv.set(`webhooks:${accountId}`, updatedWebhooks);
    
    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully',
    });
  } catch (error) {
    console.error('Delete webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to test webhook delivery
async function testWebhook(webhook: Webhook, payload: any) {
  try {
    const signature = await createHmacSignature(
      webhook.secret,
      JSON.stringify(payload)
    );
    
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-ID': webhook.id,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.error(`Webhook test failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Webhook test error:', error);
  }
}

 