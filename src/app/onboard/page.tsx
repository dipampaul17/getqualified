'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OAuthButton } from '@/components/ui/oauth-button';
import { Check } from 'lucide-react';

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    industry: '',
    teamSize: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Step 1: Collect email/password
    if (step === 1) {
      // Basic validation
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      setError(null);
      setStep(2);
      return;
    }
    
    // Step 2: Submit signup
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      
      // Success - redirect to installation guide for new users
      router.push('/dashboard/install');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
      setLoading(false);
    }
  };

  const benefits = [
    '14-day free trial',
    'No credit card required',
    'Cancel anytime',
    'Full feature access',
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[480px] animate-fade-in">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center mb-6">
              <div className="text-sm font-medium px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full">
                Qualified
              </div>
            </Link>
            <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
              {step === 1 ? 'Create your account' : 'Tell us about your company'}
            </h1>
            <p className="text-zinc-600">
              {step === 1 
                ? 'Start your 14-day free trial' 
                : 'Help us personalize your experience'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex-1 h-1 bg-zinc-900 rounded-full" />
            <div className={`flex-1 h-1 rounded-full ${step === 2 ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="space-y-3 mb-6">
                <OAuthButton provider="google" />
                <OAuthButton provider="github" />
                <OAuthButton provider="microsoft" />
                <OAuthButton provider="slack" />
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-zinc-500">Or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Work email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="password"
                    placeholder="Create password (8+ characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    required
                    minLength={8}
                  />
                </div>

                <div className="text-xs text-zinc-500">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-zinc-900 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-zinc-900 hover:underline">
                    Privacy Policy
                  </Link>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  Continue
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all appearance-none bg-white"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all appearance-none bg-white"
                  required
                >
                  <option value="">Select team size</option>
                  <option value="1">Just me</option>
                  <option value="2-10">2-10 people</option>
                  <option value="11-50">11-50 people</option>
                  <option value="51-200">51-200 people</option>
                  <option value="201+">201+ people</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-zinc-200 hover:bg-zinc-50"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  {loading ? 'Creating account...' : 'Complete setup'}
                </Button>
              </div>
            </form>
          )}

          <p className="text-center mt-6 text-sm text-zinc-600">
            Already have an account?{' '}
            <Link href="/login" className="text-zinc-900 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-zinc-50 items-center justify-center p-8">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">
            Start qualifying leads in minutes
          </h2>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-zinc-700">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-white rounded-lg border border-zinc-200">
            <p className="text-sm text-zinc-600 italic">
              "Qualified helped us increase our demo conversion rate by 127% in just 2 weeks. The AI qualification is incredibly accurate."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-200 rounded-full" />
              <div>
                <p className="text-sm font-medium text-zinc-900">Sarah Chen</p>
                <p className="text-xs text-zinc-600">Head of Sales, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 