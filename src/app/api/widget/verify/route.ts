import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, domain } = await request.json();
    
    if (!apiKey || !domain) {
      return NextResponse.json({ 
        error: 'Missing required parameters',
        verified: false 
      }, { status: 400 });
    }
    
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Mock verification for development
      return NextResponse.json({ 
        verified: true,
        message: 'Widget installation verified successfully',
        domain: domain,
        timestamp: new Date().toISOString()
      });
    }
    
    // Validate API key
    const isValidKey = await kv.get(`account:${apiKey}`);
    if (!isValidKey) {
      return NextResponse.json({ 
        error: 'Invalid API key',
        verified: false 
      }, { status: 401 });
    }
    
    // Record the verification
    const verificationKey = `verified:${apiKey}:${domain}`;
    await kv.set(verificationKey, {
      verified: true,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    }, { ex: 86400 }); // Expire after 24 hours
    
    // Set CORS headers for cross-origin requests
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    
    return new Response(JSON.stringify({ 
      verified: true,
      message: 'Widget installation verified successfully',
      domain: domain,
      timestamp: new Date().toISOString()
    }), { 
      status: 200,
      headers: responseHeaders 
    });
    
  } catch (error) {
    console.error('Widget verification error:', error);
    return NextResponse.json({ 
      error: 'Verification failed',
      verified: false 
    }, { status: 500 });
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
    },
  });
} 