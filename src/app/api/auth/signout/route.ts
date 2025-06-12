import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';

export async function POST(request: NextRequest) {
  try {
    // Clear session cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    
    // If using Supabase in production, also sign out from Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      try {
        const supabase = await createClient();
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Supabase signout error:', error);
        // Continue with local signout even if Supabase fails
      }
    }
    
    return response;
  } catch (error) {
    console.error('Signout error:', error);
    // Fallback: redirect to login even on error
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Support GET for link-based logout
export async function GET(request: NextRequest) {
  return POST(request);
} 