'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Search, Code, FileText, Zap, Book, ChevronRight, ExternalLink } from 'lucide-react';

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/pricing" className="text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                Pricing
              </Link>
              <div className="h-4 w-px bg-zinc-200 mx-1"></div>
              <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                Sign in
              </Link>
              <Button size="sm" variant="default" className="font-medium rounded-md" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 border-r border-zinc-200 fixed top-16 bottom-0 overflow-y-auto px-4 py-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search documentation"
                className="w-full h-9 pl-10 pr-4 rounded-md border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-300 bg-zinc-50 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Getting Started */}
            <div>
              <h3 className="font-medium text-xs text-zinc-500 uppercase tracking-wider mb-3">Getting Started</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#introduction" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link href="#quick-start" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Quick Start Guide
                  </Link>
                </li>
                <li>
                  <Link href="#installation" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Installation
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Core Concepts */}
            <div>
              <h3 className="font-medium text-xs text-zinc-500 uppercase tracking-wider mb-3">Core Concepts</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#lead-qualification" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Lead Qualification
                  </Link>
                </li>
                <li>
                  <Link href="#widget-customization" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Widget Customization
                  </Link>
                </li>
                <li>
                  <Link href="#analytics-dashboard" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Analytics Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* API Reference */}
            <div>
              <h3 className="font-medium text-xs text-zinc-500 uppercase tracking-wider mb-3">API Reference</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#authentication" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link href="#leads-api" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Leads API
                  </Link>
                </li>
                <li>
                  <Link href="#widgets-api" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Widgets API
                  </Link>
                </li>
                <li>
                  <Link href="#webhooks" className="text-sm block py-1 px-3 rounded hover:bg-zinc-50 text-zinc-900">
                    Webhooks
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
            {/* Hero */}
            <div className="mb-12 border-b border-zinc-100 pb-12">
              <h1 className="text-2xl md:text-3xl font-medium text-black mb-4">Documentation</h1>
              <p className="text-lg text-zinc-600 mb-6">
                Learn how to integrate and customize Qualified to capture and qualify leads on your website.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start h-auto py-3 px-4 border-zinc-200 shadow-none hover:border-zinc-300">
                  <div>
                    <div className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      <span className="font-medium text-sm">Quick Start Guide</span>
                    </div>
                    <p className="text-xs text-zinc-500 text-left mt-1">
                      Get up and running in under 5 minutes
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3 px-4 border-zinc-200 shadow-none hover:border-zinc-300">
                  <div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="font-medium text-sm">API Reference</span>
                    </div>
                    <p className="text-xs text-zinc-500 text-left mt-1">
                      Complete API documentation
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </div>
            </div>

            {/* Getting Started */}
            <div id="introduction" className="mb-12 scroll-mt-20">
              <h2 className="text-xl font-medium text-black mb-4">Introduction</h2>
              <p className="text-zinc-600 mb-4">
                Qualified helps you identify and qualify leads on your website through an interactive widget. 
                Once installed, it automatically engages visitors, asks qualifying questions, and helps you 
                focus on the most promising leads.
              </p>
              <p className="text-zinc-600 mb-6">
                This documentation will guide you through installing the widget, customizing it for your needs,
                and using the dashboard to track and analyze your leads.
              </p>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                <div className="flex">
                  <Zap className="h-5 w-5 text-zinc-700 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="font-medium text-zinc-900">Quick tip</h4>
                    <p className="text-sm text-zinc-600 mt-1">
                      For the fastest setup, copy your API key from the dashboard and add our widget script to
                      your website's HTML. It's just one line of code!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start */}
            <div id="quick-start" className="mb-12 scroll-mt-20">
              <h2 className="text-xl font-medium text-black mb-4">Quick Start Guide</h2>
              <ol className="space-y-6">
                <li>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-zinc-900">Create an account</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Sign up for Qualified using your email address. No credit card required for the free plan.
                      </p>
                      <div className="mt-2">
                        <Button variant="default" size="sm" className="h-8 rounded-md" asChild>
                          <Link href="/onboard">Sign up free</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-zinc-900">Get your API key</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Find your API key in the dashboard under the "API Key" section.
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-zinc-900">Add the widget to your site</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Copy and paste this snippet just before the closing <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag of your website.
                      </p>
                      <div className="mt-3 relative">
                        <pre className="bg-zinc-50 border border-zinc-200 text-zinc-800 p-4 rounded-md text-sm overflow-x-auto font-mono">
                          <code>{`<!-- Qualified Lead Widget -->
<script 
  src="https://app.qualified.com/widget.js" 
  data-key="YOUR_API_KEY"
  async>
</script>`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-zinc-900">Customize your widget</h3>
                      <p className="text-sm text-zinc-600 mt-1">
                        Visit the dashboard to customize your qualification questions, widget appearance, and lead scoring.
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            {/* Next/Resources Section */}
            <div className="mt-16 border-t border-zinc-100 pt-8">
              <h3 className="text-lg font-medium text-black mb-4">Ready to explore further?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-3 px-4 border-zinc-200 shadow-none hover:border-zinc-300" asChild>
                  <Link href="#installation">
                    <div>
                      <div className="flex items-center">
                        <Book className="h-4 w-4 mr-2" />
                        <span className="font-medium text-sm">Installation guides</span>
                      </div>
                      <p className="text-xs text-zinc-500 text-left mt-1">
                        Platform-specific instructions
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3 px-4 border-zinc-200 shadow-none hover:border-zinc-300" asChild>
                  <Link href="#webhooks">
                    <div>
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        <span className="font-medium text-sm">Webhooks</span>
                      </div>
                      <p className="text-xs text-zinc-500 text-left mt-1">
                        Integrate with your CRM
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="mt-16">
              <div className="bg-black text-white rounded-lg p-6">
                <h3 className="font-medium text-lg mb-2">Need help?</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Our support team is available to help you get the most out of Qualified.
                </p>
                <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-zinc-100">
                  Contact support
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-10 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-black transition-colors">
                Terms
              </Link>
              <span className="h-4 w-px bg-zinc-200 mx-1"></span>
              <Link href="mailto:help@qualified.com" className="text-sm text-zinc-500 hover:text-black transition-colors">
                help@qualified.com
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
