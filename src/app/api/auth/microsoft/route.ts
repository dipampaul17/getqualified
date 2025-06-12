import { NextResponse } from 'next/server';

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const MICROSOFT_TENANT_ID = process.env.MICROSOFT_TENANT_ID || 'common';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/microsoft/callback`
  : 'http://localhost:3000/api/auth/microsoft/callback';

export async function GET() {
  // In development, redirect directly to dashboard
  if (process.env.NODE_ENV === 'development' && !MICROSOFT_CLIENT_ID) {
    const response = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    
    // Set a mock session cookie
    response.cookies.set('session', JSON.stringify({
      user: {
        id: 'dev-microsoft-user',
        email: 'user@microsoft.com',
        name: 'Microsoft User',
        provider: 'microsoft'
      },
      accountId: 'dev-account-123'
    }), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  }

  // Microsoft OAuth URL
  const microsoftAuthUrl = new URL(`https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`);
  microsoftAuthUrl.searchParams.set('client_id', MICROSOFT_CLIENT_ID);
  microsoftAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  microsoftAuthUrl.searchParams.set('response_type', 'code');
  microsoftAuthUrl.searchParams.set('scope', 'openid email profile');
  microsoftAuthUrl.searchParams.set('response_mode', 'query');

  return NextResponse.redirect(microsoftAuthUrl);
} 