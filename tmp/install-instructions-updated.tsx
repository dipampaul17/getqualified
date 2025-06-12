'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export function InstallInstructions({ apiKey }: { apiKey: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const installCode = `<!-- Qualified Lead Widget -->
<script 
  src="https://app.qualified.com/widget.js" 
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
    <Card className="border border-zinc-200 shadow-none hover:border-zinc-300 transition-colors mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 bg-zinc-100 rounded-md">
              <Code className="h-3.5 w-3.5 text-zinc-600" />
            </div>
            <CardTitle className="text-lg font-medium">Install Widget</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-zinc-500 hover:text-black"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1.5" /> Hide
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1.5" /> Show
              </>
            )}
          </Button>
        </div>
        <CardDescription className="text-zinc-500 mt-1.5">
          Add our lead qualification widget to your website in under 2 minutes.
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-6 pt-3">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">1</span>
                </div>
                <h4 className="text-sm font-medium text-black">Copy this code</h4>
              </div>
              <div className="relative">
                <pre className="bg-zinc-50 border border-zinc-200 text-zinc-800 p-4 rounded-md text-sm overflow-x-auto font-mono">
                  <code>{installCode}</code>
                </pre>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 h-7 px-2 text-xs shadow-none border border-zinc-300"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">2</span>
                </div>
                <h4 className="text-sm font-medium text-black">Add to your website</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Paste the code in one of these locations:
              </p>
              <ul className="space-y-1.5 ml-5 text-sm text-zinc-600 list-disc">
                <li>Just before the closing <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag</li>
                <li>In your site's footer template</li>
                <li>Through your CMS or website builder's custom code section</li>
                <li>Via Google Tag Manager</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">3</span>
                </div>
                <h4 className="text-sm font-medium text-black">Test the widget</h4>
              </div>
              <p className="text-sm text-zinc-600">
                After installation, you should see:
              </p>
              <ul className="space-y-1.5 ml-5 text-sm text-zinc-600 list-disc">
                <li>A chat bubble in the bottom-right corner</li>
                <li>Widget opens automatically after 3 seconds</li>
                <li>Qualification questions appear when clicked</li>
                <li>Analytics appear in this dashboard</li>
              </ul>
            </div>
            
            {/* Platform guides */}
            <div className="pt-2 border-t border-zinc-100">
              <h4 className="text-sm font-medium text-black mb-3">Platform guides</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto py-2 px-3 text-left justify-start flex-col items-start gap-1 border-zinc-200 shadow-none hover:border-zinc-300">
                  <span className="text-sm font-medium text-black">WordPress</span>
                  <span className="text-xs text-zinc-500">Add to footer.php</span>
                </Button>
                <Button variant="outline" className="h-auto py-2 px-3 text-left justify-start flex-col items-start gap-1 border-zinc-200 shadow-none hover:border-zinc-300">
                  <span className="text-sm font-medium text-black">Shopify</span>
                  <span className="text-xs text-zinc-500">Theme settings</span>
                </Button>
                <Button variant="outline" className="h-auto py-2 px-3 text-left justify-start flex-col items-start gap-1 border-zinc-200 shadow-none hover:border-zinc-300">
                  <span className="text-sm font-medium text-black">Squarespace</span>
                  <span className="text-xs text-zinc-500">Code injection</span>
                </Button>
                <Button variant="outline" className="h-auto py-2 px-3 text-left justify-start flex-col items-start gap-1 border-zinc-200 shadow-none hover:border-zinc-300">
                  <span className="text-sm font-medium text-black">Webflow</span>
                  <span className="text-xs text-zinc-500">Custom code</span>
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">?</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-black">Need help?</h4>
                <p className="text-sm text-zinc-600 mt-1">
                  Contact our support team at{' '}
                  <a href="mailto:support@qualified.com" className="text-black hover:underline">
                    support@qualified.com
                  </a>{' '}
                  or check our{' '}
                  <a href="/docs" className="text-black hover:underline">
                    documentation
                  </a>{' '}
                  for detailed guides.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
