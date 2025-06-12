import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // In development mode, simulate email sending
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Generate a mock reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      console.log('Password reset link (development):', resetUrl);
      
      return NextResponse.json({ 
        success: true,
        message: 'Reset email sent successfully',
        // Include URL in dev for testing
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      });
    }
    
    // Production: integrate with email service
    // TODO: Implement actual email sending
    // 1. Check if user exists in database
    // 2. Generate secure reset token
    // 3. Store token with expiration (e.g., 1 hour)
    // 4. Send email with reset link
    // 5. Log the reset attempt
    
    return NextResponse.json({ 
      success: true,
      message: 'If an account exists with this email, you will receive a reset link'
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Failed to process reset request' }, { status: 500 });
  }
} 