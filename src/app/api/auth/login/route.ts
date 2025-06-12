import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // In development mode without Supabase, mock authentication
    if (process.env.NODE_ENV === 'development' && !supabaseUrl) {
      // Simple mock authentication
      if (email === 'demo@qualify.ai' && password === 'demo123') {
        const response = NextResponse.json({ success: true });
        
        // Set session cookie
        response.cookies.set('session', JSON.stringify({
          user: {
            id: 'dev-user-123',
            email: email,
            name: 'Demo User',
            provider: 'email'
          },
          accountId: 'dev-account-123'
        }), {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        
        return response;
      } else {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // Production authentication with Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get or create account
    const { data: account } = await supabase
      .from('accounts')
      .select('id')
      .eq('owner_id', data.user.id)
      .single();

    const response = NextResponse.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || email.split('@')[0],
      }
    });

    // Set session cookie
    response.cookies.set('session', JSON.stringify({
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || email.split('@')[0],
        provider: 'email'
      },
      accountId: account?.id || null,
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 