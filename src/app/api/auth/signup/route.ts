import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function generateApiKey(): string {
  const timestamp = Date.now().toString(36);
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return `pk_live_${timestamp}${randomBytes}`;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      fullName, 
      companyName, 
      industry, 
      teamSize 
    } = await request.json();

    // Validate required fields
    if (!email || !password || !fullName || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // In development mode, mock signup
    if (process.env.NODE_ENV === 'development' || !supabaseUrl) {
      const userId = 'user_' + crypto.randomUUID();
      const accountId = 'account_' + crypto.randomUUID();
      
      const response = NextResponse.json({ 
        success: true,
        message: 'Account created successfully'
      });
      
      // Set session cookie
      response.cookies.set('session', JSON.stringify({
        user: {
          id: userId,
          email: email,
          name: fullName,
          provider: 'email'
        },
        accountId: accountId,
        createdAt: Date.now()
      }), {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      return response;
    }

    // Production signup with Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
      
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
          company_name: companyName,
          industry: industry,
          team_size: teamSize,
        }
      }
    });

    if (authError || !authData.user) {
      console.error('Auth signup error:', authError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Create account record
    const apiKey = generateApiKey();
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .insert({
        owner_id: authData.user.id,
        email: email,
        company_name: companyName,
        api_key: apiKey,
        plan: 'free',
        industry: industry || 'other',
        metadata: {
          team_size: teamSize,
          signup_date: new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (accountError) {
      console.error('Account creation error:', accountError);
      // Clean up auth user if account creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Send welcome email (in production)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with email service (SendGrid, Resend, etc.)
      console.log('Would send welcome email to:', email);
    }

    const response = NextResponse.json({ 
      success: true,
      message: 'Account created successfully'
    });
    
    // Set session cookie
    response.cookies.set('session', JSON.stringify({
      user: {
        id: authData.user.id,
        email: email,
        name: fullName,
        provider: 'email'
      },
      accountId: account.id,
      accessToken: authData.session?.access_token,
      refreshToken: authData.session?.refresh_token,
      createdAt: Date.now()
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 