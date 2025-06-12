'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Copy, Check, ArrowRight, Code, Globe, Zap, RefreshCw } from 'lucide-react';

export default function InstallPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const response = await fetch('/api/account');
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.api_key || '');
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
    }
  };

  const getInstallCode = () => {
    return `<!-- Qualify.ai Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['QualifyWidget']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','qualify','${process.env.NEXT_PUBLIC_APP_URL || 'https://qualify.ai'}/widget.js'));
  
  qualify('init', '${apiKey}');
</script>
<!-- End Qualify.ai Widget -->`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getInstallCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const verifyInstallation = async () => {
    if (!domain || !apiKey) return;

    setVerifying(true);
    try {
      const response = await fetch('/api/widget/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, domain }),
      });

      if (response.ok) {
        const data = await response.json();
        setVerified(data.verified);
        if (data.verified) {
          // Success! Redirect to dashboard after a moment
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setVerifying(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Copy the code',
      description: 'Click the button below to copy your unique widget code',
      icon: <Copy className="w-5 h-5" />,
    },
    {
      number: 2,
      title: 'Add to your site',
      description: 'Paste the code before the closing </body> tag on every page',
      icon: <Code className="w-5 h-5" />,
    },
    {
      number: 3,
      title: 'Verify installation',
      description: 'Enter your domain below and we\'ll check if it\'s working',
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-semibold text-zinc-900">Install Qualify.ai Widget</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
            Let's get your widget installed
          </h2>
          <p className="text-zinc-600 max-w-md mx-auto">
            Follow these simple steps to start qualifying leads on your website in under 2 minutes
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`bg-white rounded-lg border p-6 transition-all ${
                index === 0 || (index === 1 && copied) || (index === 2 && copied)
                  ? 'border-zinc-900 shadow-sm'
                  : 'border-zinc-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  (index === 0 && copied) || (index === 1 && copied) || (index === 2 && verified)
                    ? 'bg-green-100 text-green-600'
                    : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {(index === 0 && copied) || (index === 2 && verified) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                    Step {step.number}: {step.title}
                  </h3>
                  <p className="text-zinc-600 mb-4">{step.description}</p>
                  
                  {index === 0 && (
                    <>
                      <div className="bg-zinc-50 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{getInstallCode()}</pre>
                      </div>
                      <Button
                        onClick={copyToClipboard}
                        className="bg-zinc-900 hover:bg-zinc-800"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy code
                          </>
                        )}
                      </Button>
                    </>
                  )}
                  
                  {index === 1 && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-zinc-600">
                          Works with any website builder (WordPress, Shopify, Webflow, etc.)
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-zinc-600">
                          The widget loads asynchronously and won't slow down your site
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-zinc-600">
                          Need help? Check out our{' '}
                          <a href="/docs/installation" className="text-zinc-900 underline">
                            installation guides
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="yourwebsite.com"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        />
                        <Button
                          onClick={verifyInstallation}
                          disabled={!domain || verifying || verified}
                          className="bg-zinc-900 hover:bg-zinc-800"
                        >
                          {verifying ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : verified ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Verified!
                            </>
                          ) : (
                            'Verify'
                          )}
                        </Button>
                      </div>
                      {verified && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            🎉 Great! Your widget is installed and working. Redirecting to dashboard...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-3">Need help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/docs/wordpress"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🔵</span>
              </div>
              <div>
                <p className="font-medium text-zinc-900">WordPress</p>
                <p className="text-sm text-zinc-600">Step-by-step guide</p>
              </div>
            </a>
            <a
              href="/docs/shopify"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🛍️</span>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Shopify</p>
                <p className="text-sm text-zinc-600">Theme installation</p>
              </div>
            </a>
            <a
              href="/docs/custom"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Custom Site</p>
                <p className="text-sm text-zinc-600">HTML/React/Vue</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 