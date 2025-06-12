'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
            Check your email
          </h1>
          <p className="text-zinc-600 mb-6">
            We've sent a password reset link to {email}
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            Didn't receive the email? Check your spam folder or{' '}
            <button 
              onClick={() => {
                setSubmitted(false);
                setError(null);
              }}
              className="text-zinc-900 hover:underline font-medium"
            >
              try again
            </button>
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="text-sm font-medium px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full">
              Qualified
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-zinc-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              required
              autoFocus
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
} 