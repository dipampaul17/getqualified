import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`
  : 'http://localhost:3000/api/auth/github/callback';

export async function GET() {
  // In development, redirect directly to dashboard
  if (process.env.NODE_ENV === 'development' && !GITHUB_CLIENT_ID) {
    const response = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    
    // Set a mock session cookie
    response.cookies.set('session', JSON.stringify({
      user: {
        id: 'dev-github-user',
        email: 'user@github.com',
        name: 'GitHub User',
        provider: 'github'
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

  // GitHub OAuth URL
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  githubAuthUrl.searchParams.set('scope', 'user:email');

  return NextResponse.redirect(githubAuthUrl);
} 