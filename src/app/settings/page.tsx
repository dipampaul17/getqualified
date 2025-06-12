'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, RefreshCw, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface Account {
  id: string;
  email: string;
  company_name: string;
  api_key: string;
  plan: string;
  industry: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      // In development, use mock data
      if (process.env.NODE_ENV === 'development') {
        const mockAccount = {
          id: 'dev-account-123',
          email: 'demo@qualify.ai',
          company_name: 'Demo Company',
          api_key: 'pk_test_demo123456789',
          plan: 'free',
          industry: 'saas',
        };
        setAccount(mockAccount);
        setCompanyName(mockAccount.company_name);
        setIndustry(mockAccount.industry);
        setLoading(false);
        return;
      }

      // Production: fetch from API
      const response = await fetch('/api/account');
      if (!response.ok) {
        throw new Error('Failed to fetch account');
      }
      
      const data = await response.json();
      setAccount(data);
      setCompanyName(data.company_name);
      setIndustry(data.industry);
    } catch (err) {
      setError('Failed to load account settings');
      console.error('Account fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = () => {
    if (account?.api_key) {
      navigator.clipboard.writeText(account.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const regenerateApiKey = async () => {
    if (!confirm('Are you sure? This will invalidate your current API key.')) {
      return;
    }

    setRegenerating(true);
    try {
      const response = await fetch('/api/account/regenerate-key', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to regenerate API key');
      }
      
      const data = await response.json();
      setAccount(prev => prev ? { ...prev, api_key: data.apiKey } : null);
      
      // Show the new key
      setShowApiKey(true);
    } catch (err) {
      setError('Failed to regenerate API key');
    } finally {
      setRegenerating(false);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          industry: industry,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setAccount(prev => prev ? { 
        ...prev, 
        company_name: companyName,
        industry: industry 
      } : null);
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = 'Settings saved successfully';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    return key.substring(0, 10) + '...' + key.substring(key.length - 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
          <p className="text-zinc-600 mt-2">Manage your account and API settings</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* API Key Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>
              Use this key to authenticate your widget installation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-sm bg-zinc-100 px-4 py-2 rounded-lg">
                {showApiKey ? account?.api_key : maskApiKey(account?.api_key || '')}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={copyApiKey}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={regenerateApiKey}
                disabled={regenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
            <p className="text-sm text-zinc-600">
              Keep your API key secure. Don't share it publicly or commit it to version control.
            </p>
          </CardContent>
        </Card>

        {/* Company Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  required
                >
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <Button
                type="submit"
                disabled={saving}
                className="bg-zinc-900 text-white hover:bg-zinc-800"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-sm text-zinc-600">Email</span>
              <span className="text-sm font-medium">{account?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-sm text-zinc-600">Current Plan</span>
              <span className="text-sm font-medium capitalize">{account?.plan}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-sm text-zinc-600">Account ID</span>
              <span className="text-sm font-mono">{account?.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Implement account deletion
                  console.log('Account deletion requested');
                }
              }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 