'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PLANS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zinc-200/80">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/docs" className="text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                Documentation
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

      <div className="pt-36 pb-20 px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-zinc-600 max-w-xl mx-auto">
            Start for free, upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Free Plan */}
            <div className="border border-zinc-200 rounded-lg p-6 hover:border-zinc-300 transition-colors">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-black mb-1">Free</h3>
                <div className="text-2xl font-medium text-black">$0</div>
                <p className="text-zinc-500 text-sm">forever</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">100 leads/month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Basic qualification</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Email support</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Qualified branding</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full rounded-md shadow-none h-9 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50" asChild>
                <Link href="/onboard">Start for free</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="border border-black rounded-lg p-6 bg-black text-white">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-1">Pro</h3>
                <div className="text-2xl font-medium">$49</div>
                <p className="text-zinc-400 text-sm">per month</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">1,000 leads/month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced qualification</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">CRM integration</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">White-labeling</span>
                </li>
              </ul>
              
              <Button 
                variant="secondary"
                className="w-full rounded-md h-9 bg-white text-black hover:bg-zinc-100"
                onClick={() => handleUpgrade('pro')}
                disabled={loading === 'pro'}
              >
                {loading === 'pro' ? 'Loading...' : 'Upgrade to Pro'}
              </Button>
            </div>

            {/* Scale Plan */}
            <div className="border border-zinc-200 rounded-lg p-6 hover:border-zinc-300 transition-colors">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-black mb-1">Scale</h3>
                <div className="text-2xl font-medium text-black">$299</div>
                <p className="text-zinc-500 text-sm">per month</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">10,000 leads/month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Custom questions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">API access</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">Dedicated support</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-600">White-label</span>
                </li>
              </ul>
              
              <Button 
                variant="outline"
                className="w-full rounded-md shadow-none h-9 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
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
          <h2 className="text-xl font-medium text-black mb-8 text-center">
            Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="font-medium text-black mb-2">
                How does the free plan work?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                100 leads per month, forever. No credit card needed. Perfect for testing 
                on your site before upgrading.
              </p>
            </div>
            
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="font-medium text-black mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Yes. Upgrade, downgrade, or cancel anytime. Changes take effect immediately 
                and we'll prorate your billing.
              </p>
            </div>
            
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="font-medium text-black mb-2">
                What happens if I hit my limit?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                We'll email you at 80% usage. If you hit 100%, the widget keeps working 
                but stops collecting new leads until next month.
              </p>
            </div>
            
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="font-medium text-black mb-2">
                Do you offer annual billing?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Yes. Pay annually and get 2 months free on any paid plan. 
                Contact us at billing@qualified.com to switch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-10 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
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
