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

// Helper function to trigger webhooks
export async function triggerWebhooks(
  accountId: string,
  event: WebhookEvent,
  data: any
) {
  try {
    const webhooks = (await kv.get(`webhooks:${accountId}`) || []) as Webhook[];
    
    // Filter active webhooks that subscribe to this event
    const relevantWebhooks = webhooks.filter(w => 
      w.active && w.events.includes(event)
    );
    
    // Send webhooks in parallel
    await Promise.all(
      relevantWebhooks.map(async (webhook) => {
        const payload = {
          event,
          data,
          timestamp: new Date().toISOString(),
          account_id: accountId,
        };
        
        const signature = await createHmacSignature(
          webhook.secret,
          JSON.stringify(payload)
        );
        
        try {
          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Signature': signature,
              'X-Webhook-Event': event,
              'X-Webhook-ID': webhook.id,
            },
            body: JSON.stringify(payload),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          // Update last triggered
          webhook.last_triggered = new Date().toISOString();
          webhook.failure_count = 0;
        } catch (error) {
          console.error(`Webhook delivery failed for ${webhook.id}:`, error);
          webhook.failure_count++;
          
          // Disable webhook after 5 consecutive failures
          if (webhook.failure_count >= 5) {
            webhook.active = false;
          }
        }
      })
    );
    
    // Save updated webhook states
    await kv.set(`webhooks:${accountId}`, webhooks);
  } catch (error) {
    console.error('Trigger webhooks error:', error);
  }
} 