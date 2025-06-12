import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-auth';
import { DashboardMetrics } from '@/components/dashboard-metrics';
import { RecentLeads } from '@/components/recent-leads';
import { InstallInstructions } from '@/components/install-instructions';
import { SubscriptionManagement } from '@/components/subscription-management';
import { LogoutButton } from '@/components/logout-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Settings, Zap, Code2, CreditCard, FileText } from 'lucide-react';

export default async function Dashboard() {
  // Check if we're in dev mode without Supabase
  const isDevMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  
  let session = null;
  
  if (!isDevMode) {
    // Only create Supabase client if we have valid configuration
    const supabase = await createClient();
    const { data: { session: supabaseSession } } = await supabase.auth.getSession();
    session = supabaseSession;
    
    // Redirect if not authenticated (in production)
    if (!session) {
      redirect('/login');
    }
  }

  // Mock data for development
  const account = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    company_name: 'Acme Corp',
    api_key: 'pk_test_' + Math.random().toString(36).substring(2, 15),
    plan: 'free',
    industry: 'saas',
  } : {
    id: 'mock-id',
    email: 'demo@qualify.ai',
    company_name: 'Demo Company',
    api_key: 'pk_test_demo123456789',
    plan: 'free',
    industry: 'saas',
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-zinc-900" />
              <span className="text-xl font-semibold text-zinc-900">Qualify.ai</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/docs" className="text-zinc-600 hover:text-zinc-900 font-medium hidden md:block">
                Documentation
              </Link>
              <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900 font-medium hidden md:block">
                Pricing
              </Link>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Welcome back!</h1>
          <p className="text-zinc-600 mt-1">Here's what's happening with your leads today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardDescription>Total Leads</CardDescription>
              <CardTitle className="text-2xl">127</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-600">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardDescription>Qualified Leads</CardDescription>
              <CardTitle className="text-2xl">34</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-600">26.8% qualification rate</p>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardDescription>Conversion Lift</CardDescription>
              <CardTitle className="text-2xl">+38%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-600">From A/B testing</p>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardDescription>Active Sites</CardDescription>
              <CardTitle className="text-2xl">2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-600">Widget installed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Development Mode Notice */}
            {isDevMode && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Zap className="h-5 w-5" />
                    Development Mode Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 mb-4">
                    You're viewing mock data. Connect your database to see real leads.
                  </p>
                  <Button variant="outline" size="sm" className="border-amber-300 text-amber-900 hover:bg-amber-100">
                    View Setup Guide
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* API Key */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Your API Key
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    Regenerate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-zinc-100 rounded-md text-sm font-mono">
                    {account.api_key}
                  </code>
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-zinc-600 mt-2">
                  Keep this secret! This key identifies your account when using the widget.
                </p>
              </CardContent>
            </Card>

            {/* Install Instructions */}
            <InstallInstructions apiKey={account.api_key} />

            {/* A/B Test Metrics */}
            <DashboardMetrics accountId={account.id} />

            {/* Recent Leads */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Qualified Leads</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RecentLeads accountId={account.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{account.company_name}</p>
                  <p className="text-sm text-zinc-600">{account.email}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-zinc-600 mb-1">Industry</p>
                  <p className="text-sm font-medium text-zinc-900 capitalize">{account.industry}</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Management */}
            <SubscriptionManagement account={account} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/billing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing & Invoices
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/docs">
                    <FileText className="h-4 w-4 mr-2" />
                    API Documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-zinc-900 text-white border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 mb-4 text-sm">
                  Our support team is here to help you get the most out of Qualify.ai
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 