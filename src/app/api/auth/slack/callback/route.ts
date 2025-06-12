import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID || '';
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/slack/callback`
  : 'http://localhost:3000/api/auth/slack/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://slack.com/api/openid.connect.token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await tokenResponse.json();

    if (!tokens.ok) {
      throw new Error(tokens.error || 'OAuth error');
    }

    // Get user info
    const userResponse = await fetch('https://slack.com/api/openid.connect.userInfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();

    if (!userData.ok) {
      throw new Error(userData.error || 'Failed to get user info');
    }

    // Create user object
    const user = {
      id: `slack_${userData.sub}`,
      email: userData.email,
      name: userData.name,
      avatar_url: userData.picture,
      provider: 'slack',
    };

    // In development, just set session
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      response.cookies.set('session', JSON.stringify({
        user,
        accountId: `account-${user.id}`,
        createdAt: Date.now()
      }), {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    // Production: Create or update user in database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists
    let { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: user.email,
          name: user.name,
          provider: 'slack',
          provider_id: userData.sub,
          avatar_url: user.avatar_url,
        })
        .select()
        .single();

      if (createError) throw createError;
      existingUser = newUser;
    }

    if (!existingUser) {
      throw new Error('Failed to create or find user');
    }

    // Get or create account
    let { data: account } = await supabase
      .from('accounts')
      .select('*')
      .eq('owner_id', existingUser.id)
      .single();

    if (!account) {
      // Create new account
      const { data: newAccount, error: accountError } = await supabase
        .from('accounts')
        .insert({
          owner_id: existingUser.id,
          email: user.email,
          company_name: userData.team?.name || user.name + "'s Company",
          api_key: 'pk_live_' + crypto.randomUUID(),
          plan: 'free',
        })
        .select()
        .single();

      if (accountError) throw accountError;
      account = newAccount;
    }

    // Set session and redirect
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('session', JSON.stringify({
      user: {
        ...user,
        id: existingUser.id,
      },
      accountId: account?.id,
      createdAt: Date.now()
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Slack OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
} 