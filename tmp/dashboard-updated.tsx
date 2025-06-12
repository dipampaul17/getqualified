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
import { BellIcon, Menu, LogOut, PlusCircle, FileText, Settings, Sparkles, Zap, Code2, CreditCard } from "lucide-react";
import { Logo } from "@/components/ui/logo";

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
    email: 'demo@qualified.com',
    company_name: 'Demo Company',
    api_key: 'pk_test_demo123456789',
    plan: 'free',
    industry: 'saas',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo />
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/docs" className="text-sm text-zinc-500 hover:text-black transition-colors font-medium hidden md:block">
                Documentation
              </Link>
              <Link href="/pricing" className="text-sm text-zinc-500 hover:text-black transition-colors font-medium hidden md:block">
                Pricing
              </Link>
              <div className="h-4 w-px bg-zinc-200 mx-1 hidden md:block"></div>
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-black" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-medium text-black">Welcome back!</h1>
          <p className="text-zinc-500 mt-1">Here's what's happening with your leads today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-500">Total Leads</CardDescription>
              <CardTitle className="text-2xl">127</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-500">Qualified Leads</CardDescription>
              <CardTitle className="text-2xl">34</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500">26.8% qualification rate</p>
            </CardContent>
          </Card>
          
          <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-500">Average Quality Score</CardDescription>
              <CardTitle className="text-2xl">7.2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500">+0.8 from last week</p>
            </CardContent>
          </Card>
          
          <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-500">Conversion Rate</CardDescription>
              <CardTitle className="text-2xl">19%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500">+3% from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Key */}
            <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">API Key</CardTitle>
                  <Button size="sm" variant="secondary" className="h-8 text-xs rounded-md">
                    Regenerate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-zinc-50 rounded-md text-sm font-mono border border-zinc-200">
                    {account.api_key}
                  </code>
                  <Button variant="outline" size="sm" className="h-8 shadow-none">
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Keep this secret! This key identifies your account when using the widget.
                </p>
              </CardContent>
            </Card>

            {/* Install Instructions */}
            <InstallInstructions apiKey={account.api_key} />

            {/* A/B Test Metrics */}
            <DashboardMetrics accountId={account.id} />

            {/* Recent Leads */}
            <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Recent Qualified Leads</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-black h-8">
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
            <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-black">{account.company_name}</p>
                  <p className="text-sm text-zinc-500">{account.email}</p>
                </div>
                <div className="pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-500 mb-1">Industry</p>
                  <p className="text-sm font-medium text-black capitalize">{account.industry}</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Management */}
            <SubscriptionManagement account={account} />

            {/* Quick Actions */}
            <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start h-9 rounded-md shadow-none border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50" asChild>
                  <Link href="/settings">
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    Account Settings
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-9 rounded-md shadow-none border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50" asChild>
                  <Link href="/billing">
                    <CreditCard className="h-3.5 w-3.5 mr-2" />
                    Billing & Invoices
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-9 rounded-md shadow-none border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50" asChild>
                  <Link href="/docs">
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    API Documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-black border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-white text-lg font-medium">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 mb-4 text-sm">
                  Our support team is here to help you get the most out of Qualified
                </p>
                <Button variant="secondary" size="sm" className="w-full h-9 rounded-md bg-white text-black hover:bg-zinc-100">
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
