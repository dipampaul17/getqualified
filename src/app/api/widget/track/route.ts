import { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import { createClient } from '@/lib/supabase-auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Handle both regular fetch and sendBeacon requests
    const contentType = request.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await request.json();
    } else if (contentType?.includes('text/plain')) {
      // Handle sendBeacon which sends as text/plain
      const text = await request.text();
      try {
        data = JSON.parse(text);
      } catch {
        return Response.json({ error: 'Invalid data format' }, { status: 400 });
      }
    } else {
      // Try to parse as JSON anyway
      try {
        data = await request.json();
      } catch {
        return Response.json({ error: 'Invalid request format' }, { status: 400 });
      }
    }
    
    const { apiKey, visitorId, sessionId, eventType, pageUrl, metadata = {} } = data;
    
    // Check if we're in development with placeholder values
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Just return success for development
      return Response.json({ success: true });
    }
    
    // Quick validation from cache
    const isValid = await kv.get(`account:${apiKey}`);
    if (!isValid) {
      // Verify API key exists
      const supabase = await createClient();
      const { error } = await supabase
        .from('accounts')
        .select('id')
        .eq('api_key', apiKey)
        .single();
        
      if (error) {
        return Response.json({ error: 'Invalid API key' }, { status: 401 });
      }
    }
    
    // Enhanced event data
    const eventData = {
      account_id: apiKey,
      event_type: eventType,
      visitor_id: visitorId,
      session_id: sessionId,
      page_url: pageUrl,
      metadata: {
        ...metadata,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        timestamp: metadata.timestamp || new Date().toISOString(),
        referrer: request.headers.get('referer'),
      }
    };
    
    // Save event to analytics table (skip in development)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const supabase = await createClient();
      await supabase.from('analytics').insert(eventData);
    }
    
    // Track special events in cache for real-time analytics
    if (['widget_opened', 'form_completed', 'qualified_lead'].includes(eventType)) {
      const dayKey = new Date().toISOString().split('T')[0];
      await kv.hincrby(`stats:${apiKey}:${dayKey}`, eventType, 1);
      
      // Update device type stats
      if (metadata.device) {
        await kv.hincrby(`devices:${apiKey}:${dayKey}`, metadata.device, 1);
      }
      
      // Update browser stats
      if (metadata.browser) {
        await kv.hincrby(`browsers:${apiKey}:${dayKey}`, metadata.browser, 1);
      }
    }
    
    // Set CORS headers for cross-origin requests
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      // Allow credentials for future authenticated requests
      'Access-Control-Allow-Credentials': 'true',
    });
    
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: responseHeaders 
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    // Return success even on error to not break widget
    return Response.json({ success: true });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

// Handle GET requests for health checks
export async function GET() {
  return Response.json({ status: 'ok' });
} 