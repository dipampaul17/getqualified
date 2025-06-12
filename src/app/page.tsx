import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";
import { DemoWidgetLoader } from "@/components/demo-widget-loader";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Debug element */}
      <div className="fixed top-0 left-0 w-32 h-32 bg-red-500 z-[9999] flex items-center justify-center text-white font-bold">
        DEBUG BOX
      </div>
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
              <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                Sign in
              </Link>
              <Button size="sm" className="h-8 text-sm" asChild>
                <Link href="/onboard">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-100/50 via-transparent to-transparent -z-10" />
        
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Know which leads
              <br />
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent">
                are worth your time
              </span>
            </h1>
            <p className="text-xl text-zinc-600 mb-8 max-w-2xl leading-relaxed">
              Stop wasting hours on unqualified leads. Our AI scores visitors in real-time 
              so your sales team only talks to buyers ready to purchase.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/onboard">
                  Install in 2 minutes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="#demo"
                className="text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-400 transition-colors">
                  <div className="w-0 h-0 border-l-[6px] border-l-zinc-700 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                </div>
                <span className="text-sm font-medium">See it work</span>
              </Link>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-20 border-t border-zinc-100">
            <div className="animate-fade-in">
              <div className="text-3xl font-medium text-zinc-900 mb-1">127%</div>
              <p className="text-sm text-zinc-600">More qualified demos</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-medium text-zinc-900 mb-1">3 hrs</div>
              <p className="text-sm text-zinc-600">Saved per rep daily</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-medium text-zinc-900 mb-1">&lt; 4KB</div>
              <p className="text-sm text-zinc-600">Zero impact on speed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-medium text-zinc-900 mb-12">
            Dead simple to implement
          </h2>
          
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-medium">
                1
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                  Add one line of code
                </h3>
                <p className="text-zinc-600">
                  Drop our lightweight widget on your site. Works with any stack.
                </p>
                <pre className="mt-4 p-4 bg-zinc-900 text-zinc-100 rounded-lg text-sm overflow-x-auto">
                  <code>{`<script src="https://qualify.ai/widget.js" data-key="your-key"></script>`}</code>
                </pre>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-medium">
                2
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                  AI qualifies visitors automatically
                </h3>
                <p className="text-zinc-600">
                  Smart questions adapt based on visitor behavior. No forms to build.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-medium">
                3
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                  Only hot leads reach your inbox
                </h3>
                <p className="text-zinc-600">
                  Get notified instantly when a qualified buyer is ready to talk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-medium text-zinc-900 mb-12">
            Built for revenue teams that move fast
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-zinc-700" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                Real-time scoring
              </h3>
              <p className="text-zinc-600">
                Know instantly if someone's worth talking to. No waiting for enrichment data.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-zinc-700" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                A/B test everything
              </h3>
              <p className="text-zinc-600">
                Test questions, timing, and flows. See what actually converts.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
                <div className="w-5 h-5 rounded-full border-2 border-zinc-700" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                Works everywhere
              </h3>
              <p className="text-zinc-600">
                React, Vue, WordPress, Webflow. If it runs JavaScript, we work.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
                <div className="w-5 h-5 bg-zinc-700 rounded-sm" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                Your brand, not ours
              </h3>
              <p className="text-zinc-600">
                White-label on paid plans. Looks native to your site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-zinc-900 mb-4">
              See it in action
            </h2>
            <p className="text-lg text-zinc-600">
              Click the demo button in the bottom right to experience how Qualify.ai works
            </p>
          </div>
          
          <div className="bg-white rounded-lg border border-zinc-200 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4">
                  What happens when you use Qualify.ai:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <span className="text-zinc-600">Widget appears based on your timing rules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <span className="text-zinc-600">AI asks smart qualifying questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <span className="text-zinc-600">Lead is scored in real-time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <span className="text-zinc-600">You get notified about hot leads instantly</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-zinc-50 rounded-lg p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-zinc-900 mb-2">
                    Try the demo widget
                  </h4>
                  <p className="text-sm text-zinc-600 mb-4">
                    Look for the chat button in the bottom right corner
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Demo widget is live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl text-zinc-900 font-medium mb-6">
            "Cut our sales cycle by 40%. Reps only talk to people who can actually buy."
          </blockquote>
          <cite className="text-zinc-600 not-italic">
            Sarah Chen, Head of Sales at Linear
          </cite>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-medium text-zinc-900 mb-4">
            Start qualifying leads in 2 minutes
          </h2>
          <p className="text-lg text-zinc-600 mb-8">
            Free for up to 100 leads. No credit card needed.
          </p>
          <Button size="lg" asChild>
            <Link href="/onboard">
              Get your install code
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-900">Qualify</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-sm text-zinc-600 hover:text-zinc-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-zinc-600 hover:text-zinc-900">
                Terms
              </Link>
              <Link href="mailto:help@qualify.ai" className="text-sm text-zinc-600 hover:text-zinc-900">
                help@qualify.ai
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Demo Widget */}
      <DemoWidgetLoader />
    </div>
  );
}
