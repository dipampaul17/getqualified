import { NextResponse } from 'next/server';

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/slack/callback`
  : 'http://localhost:3000/api/auth/slack/callback';

export async function GET() {
  // In development, redirect directly to dashboard
  if (process.env.NODE_ENV === 'development' && !SLACK_CLIENT_ID) {
    const response = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    
    // Set a mock session cookie
    response.cookies.set('session', JSON.stringify({
      user: {
        id: 'dev-slack-user',
        email: 'user@slack.com',
        name: 'Slack User',
        provider: 'slack'
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

  // Slack OAuth URL
  const slackAuthUrl = new URL('https://slack.com/oauth/v2/authorize');
  slackAuthUrl.searchParams.set('client_id', SLACK_CLIENT_ID);
  slackAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  slackAuthUrl.searchParams.set('scope', 'openid,email,profile');
  slackAuthUrl.searchParams.set('user_scope', 'identity.basic,identity.email,identity.avatar');

  return NextResponse.redirect(slackAuthUrl);
} 