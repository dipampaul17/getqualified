import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    
    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        id: session.accountId || 'dev-account-123',
        email: session.user?.email || 'demo@qualified.com',
        company_name: 'Demo Company',
        api_key: 'pk_test_demo123456789',
        plan: 'free',
        industry: 'saas',
      });
    }
    
    // Production: fetch from database
    // TODO: Implement database fetch
    
    return NextResponse.json({
      id: session.accountId,
      email: session.user?.email,
      company_name: 'Company Name',
      api_key: 'pk_test_' + session.accountId,
      plan: 'free',
      industry: 'saas',
    });
    
  } catch (error) {
    console.error('Account fetch error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const { company_name, industry } = await request.json();
    
    // Validate input
    if (!company_name || !industry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // In development mode, just return success
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        success: true,
        company_name,
        industry 
      });
    }
    
    // Production: update in database
    // TODO: Implement database update
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Account update error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
} 