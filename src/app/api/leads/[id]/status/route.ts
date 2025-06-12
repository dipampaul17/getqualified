import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accountId = session.accountId;
    const { id: leadId } = await params;
    
    // Get new status from request body
    const { status } = await request.json();
    
    // Validate status
    if (!['qualified', 'not_qualified', 'pending'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be: qualified, not_qualified, or pending' 
      }, { status: 400 });
    }
    
    // Handle development mode
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Return mock success
      return NextResponse.json({
        success: true,
        lead: {
          id: leadId,
          status: status,
          updated_at: new Date().toISOString()
        }
      });
    }
    
    // Production: Update in Supabase
    const supabase = await createClient();
    
    // First verify the lead belongs to this account
    const { data: lead, error: fetchError } = await supabase
      .from('leads')
      .select('id, status')
      .eq('id', leadId)
      .eq('account_id', accountId)
      .single();
    
    if (fetchError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    // Update the lead status
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .eq('account_id', accountId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating lead status:', updateError);
      return NextResponse.json({ error: 'Failed to update lead status' }, { status: 500 });
    }
    
    // Log status change in analytics
    await supabase.from('analytics').insert({
      account_id: accountId,
      event_type: 'lead_status_changed',
      metadata: {
        lead_id: leadId,
        old_status: lead.status,
        new_status: status,
        user_id: session.user.id,
        timestamp: new Date().toISOString()
      }
    });
    
    return NextResponse.json({
      success: true,
      lead: updatedLead
    });
  } catch (error) {
    console.error('Lead status update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 