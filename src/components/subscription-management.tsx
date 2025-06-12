'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PLANS } from '@/lib/constants';

interface SubscriptionManagementProps {
  account: {
    id: string;
    plan: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
  };
}

export function SubscriptionManagement({ account }: SubscriptionManagementProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPlan = PLANS[account.plan.toUpperCase() as keyof typeof PLANS] || PLANS.FREE;
  const isFreePlan = account.plan === 'free';

  const handleUpgrade = async (planKey: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      setError('Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to Stripe billing portal
      window.location.href = data.url;
    } catch (err) {
      setError('Failed to access billing portal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Subscription & Billing</h3>
        {!isFreePlan && (
          <button
            onClick={handleManageBilling}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
          >
            Manage Billing
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-600">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">Current Plan</h4>
            <p className="text-gray-600">
              {currentPlan.name} - ${currentPlan.price}/month
            </p>
            <div className="text-sm text-gray-500 mt-1">
              {currentPlan.leads.toLocaleString()} leads per month included
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isFreePlan 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isFreePlan ? 'Free Plan' : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">This Month's Usage</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Qualified Leads</span>
            <span className="font-medium">8 / {currentPlan.leads.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min((8 / currentPlan.leads) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            Resets on the 1st of each month
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Current Plan Features</h4>
        <ul className="space-y-2">
          {currentPlan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade Options */}
      {isFreePlan && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Upgrade Your Plan</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Growth Plan</div>
                <div className="text-sm text-gray-600">$99/month • 1,000 leads • A/B testing</div>
              </div>
              <button
                onClick={() => handleUpgrade('growth')}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Upgrade'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Scale Plan</div>
                <div className="text-sm text-gray-600">$299/month • 10,000 leads • API access</div>
              </div>
              <button
                onClick={() => handleUpgrade('scale')}
                disabled={loading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Upgrade'}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              href="/pricing" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View detailed plan comparison →
            </Link>
          </div>
        </div>
      )}

      {/* Paid Plan Management */}
      {!isFreePlan && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Plan Management</h4>
          <div className="space-y-3">
            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="font-medium text-gray-900">Manage Subscription</div>
              <div className="text-sm text-gray-600">Update payment method, billing info, or cancel</div>
            </button>
            
            <Link 
              href="/pricing" 
              className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Change Plan</div>
              <div className="text-sm text-gray-600">Upgrade or downgrade your subscription</div>
            </Link>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="border-t pt-6 mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help with billing?
          </p>
          <a 
            href="mailto:billing@qualify.ai" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Contact our billing support →
          </a>
        </div>
      </div>
    </div>
  );
} 