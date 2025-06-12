import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/settings', '/api/checkout', '/api/billing-portal'];
const authRoutes = ['/login', '/onboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session from cookie
  const sessionCookie = request.cookies.get('session');
  const hasSession = !!sessionCookie?.value;
  
  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Handle session validity and refresh
  if (hasSession && sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      
      // Check if session is older than 6 days (refresh before 7-day expiry)
      if (session.createdAt && Date.now() - session.createdAt > 6 * 24 * 60 * 60 * 1000) {
        // Refresh session timestamp
        const refreshResponse = NextResponse.next();
        refreshResponse.cookies.set('session', JSON.stringify({
          ...session,
          createdAt: Date.now()
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        addSecurityHeaders(refreshResponse, pathname);
        return refreshResponse;
      }
    } catch (error) {
      // Invalid session, clear it
      const clearResponse = NextResponse.next();
      clearResponse.cookies.delete('session');
      if (isProtectedRoute) {
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }
  }
  
  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !hasSession) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if accessing auth routes with session
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Default response with security headers
  const response = NextResponse.next();
  addSecurityHeaders(response, pathname);
  return response;
}

function addSecurityHeaders(response: NextResponse, pathname: string) {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CSP for non-widget routes (widget routes need different CSP)
  if (!pathname.startsWith('/api/widget')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https: blob:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co; " +
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none';"
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/widget (widget endpoints need to be publicly accessible)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/widget).*)',
  ],
}; 