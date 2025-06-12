'use client';

import { useState } from 'react';

export function InstallInstructions({ apiKey }: { apiKey: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const installCode = `<!-- Add this script tag to your website -->
<script 
  src="https://app.qualify.ai/widget.js" 
  data-key="${apiKey}"
  async>
</script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(installCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            🚀
          </div>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-900">
              Install Widget on Your Website
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isExpanded ? 'Hide instructions' : 'Show instructions'}
            </button>
          </div>
          <p className="text-blue-800 mt-1">
            Add our lead qualification widget to start capturing and qualifying leads automatically.
          </p>
          
          {isExpanded && (
            <div className="mt-6 space-y-6">
              {/* Step 1 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full mr-3">
                    1
                  </span>
                  <h4 className="font-semibold text-gray-900">Copy the widget code</h4>
                </div>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{installCode}</code>
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className={`absolute top-2 right-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full mr-3">
                    2
                  </span>
                  <h4 className="font-semibold text-gray-900">Add to your website</h4>
                </div>
                <p className="text-gray-600 mb-3">
                  Paste the code snippet in one of these locations:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-6">
                  <li>Just before the closing <code className="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
                  <li>In your site's footer template</li>
                  <li>Through your CMS or website builder's custom code section</li>
                  <li>Via Google Tag Manager or similar tag management system</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full mr-3">
                    3
                  </span>
                  <h4 className="font-semibold text-gray-900">Test the widget</h4>
                </div>
                <p className="text-gray-600 mb-3">
                  After installation, you should see:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-6">
                  <li>A chat bubble icon in the bottom-right corner</li>
                  <li>The widget opens automatically after 3 seconds</li>
                  <li>Qualification questions appear when clicked</li>
                  <li>Analytics start appearing in this dashboard</li>
                </ul>
              </div>

              {/* Platform-specific instructions */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Platform-specific guides:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      🌐
                    </div>
                    <p className="text-sm font-medium text-gray-900">WordPress</p>
                    <p className="text-xs text-gray-500">Add to footer.php</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      🏪
                    </div>
                    <p className="text-sm font-medium text-gray-900">Shopify</p>
                    <p className="text-xs text-gray-500">Theme settings</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      ⬜
                    </div>
                    <p className="text-sm font-medium text-gray-900">Squarespace</p>
                    <p className="text-xs text-gray-500">Code injection</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      🔷
                    </div>
                    <p className="text-sm font-medium text-gray-900">Webflow</p>
                    <p className="text-xs text-gray-500">Custom code</p>
                  </div>
                </div>
              </div>

              {/* Help section */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-600">💡</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-yellow-800">Need help?</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Contact our support team at{' '}
                      <a href="mailto:support@qualify.ai" className="underline">
                        support@qualify.ai
                      </a>{' '}
                      or check our{' '}
                      <a href="#" className="underline">
                        documentation
                      </a>{' '}
                      for detailed installation guides.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 