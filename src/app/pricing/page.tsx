'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PLANS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planKey: string) => {
    try {
      setLoading(planKey);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/60 backdrop-blur-xl z-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-zinc-900">Qualify</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                Sign in
              </Link>
              <Button size="sm" className="h-8 text-sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 mb-4">
            Simple pricing that scales with you
          </h1>
          <p className="text-xl text-zinc-600">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="relative rounded-2xl border border-zinc-200 p-8 animate-fade-in">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-zinc-900 mb-2">Free</h3>
                <div className="text-3xl font-medium text-zinc-900">$0</div>
                <p className="text-zinc-600 text-sm">forever</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">100 leads/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Basic qualification</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Qualify branding</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/onboard">Start free</Link>
              </Button>
            </div>

            {/* Growth Plan */}
            <div className="relative rounded-2xl border-2 border-zinc-900 p-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="absolute -top-3 left-8 px-3 bg-white">
                <span className="text-xs font-medium text-zinc-900">MOST POPULAR</span>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-zinc-900 mb-2">Growth</h3>
                <div className="text-3xl font-medium text-zinc-900">$99</div>
                <p className="text-zinc-600 text-sm">per month</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-700">1,000 leads/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-700">AI qualification</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-700">A/B testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-700">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-700">Remove branding</span>
                </li>
              </ul>
              
              <Button 
                className="w-full" 
                onClick={() => handleUpgrade('growth')}
                disabled={loading === 'growth'}
              >
                {loading === 'growth' ? 'Loading...' : 'Upgrade to Growth'}
              </Button>
            </div>

            {/* Scale Plan */}
            <div className="relative rounded-2xl border border-zinc-200 p-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-zinc-900 mb-2">Scale</h3>
                <div className="text-3xl font-medium text-zinc-900">$299</div>
                <p className="text-zinc-600 text-sm">per month</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">10,000 leads/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Custom questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">White-label</span>
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleUpgrade('scale')}
                disabled={loading === 'scale'}
              >
                {loading === 'scale' ? 'Loading...' : 'Upgrade to Scale'}
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <h2 className="text-2xl font-medium text-zinc-900 mb-8 text-center">
            Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-medium text-zinc-900 mb-2">
                How does the free plan work?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                100 leads per month, forever. No credit card needed. Perfect for testing 
                on your site before upgrading.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-zinc-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Yes. Upgrade, downgrade, or cancel anytime. Changes take effect immediately 
                and we'll prorate your billing.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-zinc-900 mb-2">
                What happens if I hit my limit?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                We'll email you at 80% usage. If you hit 100%, the widget keeps working 
                but stops collecting new leads until next month.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-zinc-900 mb-2">
                Do you offer annual billing?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Yes. Pay annually and get 2 months free on any paid plan. 
                Contact us at billing@qualify.ai to switch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 