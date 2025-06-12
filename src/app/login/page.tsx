'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OAuthButton } from '@/components/ui/oauth-button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="text-sm font-medium px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full">
              Qualify.ai
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-600">
            Sign in to your account to continue
          </p>
        </div>

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
            <span className="bg-white px-3 text-zinc-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded border-zinc-300" />
              <span className="text-zinc-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-zinc-900 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-zinc-600">
          Don't have an account?{' '}
          <Link href="/onboard" className="text-zinc-900 hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
} 