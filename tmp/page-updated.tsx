import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, TrendingUp } from "lucide-react";
import { Logo, LogoSymbol } from "@/components/ui/logo";
import { DemoWidgetLoader } from "@/components/demo-widget-loader";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zinc-200/80">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/pricing" className="text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                Documentation
              </Link>
              <div className="h-4 w-px bg-zinc-200 mx-1"></div>
              <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                Sign in
              </Link>
              <Button size="sm" variant="default" className="font-medium rounded-md" asChild>
                <Link href="/onboard">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 md:px-6">
        <div className="absolute inset-0 bg-white -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-100/40 via-transparent to-transparent -z-10" />
        
        <div className="max-w-3xl mx-auto">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-6 leading-[1.1]">
              Know which leads<br />are worth your time
            </h1>
            <p className="text-lg text-zinc-600 mb-10 max-w-2xl leading-relaxed">
              Stop wasting hours on unqualified leads. Our AI scores visitors in real-time so your sales team talks only to ready buyers.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Button size="lg" className="h-10 font-medium rounded-md px-5 shadow-none hover:shadow-sm" asChild>
                <Link href="/onboard">
                  Get started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Link
                href="#demo"
                className="text-zinc-600 hover:text-black transition-colors flex items-center gap-2 mt-1 sm:mt-0"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-zinc-600" />
                </div>
                <span className="text-sm font-medium">View demo</span>
              </Link>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-16 pt-16 border-t border-zinc-100">
            <div>
              <div className="text-3xl font-medium text-black mb-1">127%</div>
              <p className="text-sm text-zinc-500">More qualified demos</p>
            </div>
            <div>
              <div className="text-3xl font-medium text-black mb-1">3 hrs</div>
              <p className="text-sm text-zinc-500">Saved per rep daily</p>
            </div>
            <div>
              <div className="text-3xl font-medium text-black mb-1">40%</div>
              <p className="text-sm text-zinc-500">Higher conversion rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features/How It Works */}
      <section id="demo" className="py-20 px-4 md:px-6 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 mb-12">
            <h2 className="text-2xl md:text-3xl font-medium text-black">
              Qualify leads with a chat widget
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl">
              Our intelligent AI chat widget engages visitors and qualifies them, so your sales team only spends time on leads ready to buy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
              <div className="h-[420px] bg-zinc-100 flex items-center justify-center">
                <div className="text-zinc-500 text-sm">
                  Demo Widget Preview
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100">
                  <TrendingUp className="w-4 h-4 text-zinc-900" />
                </div>
                <h3 className="text-lg font-medium text-black">
                  The problem we solve
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Sales teams waste 71% of their time on leads that never convert. 
                  By pre-qualifying visitors with AI, we ensure your team focuses 
                  only on prospects ready to buy.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-black">
                  How it works
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <span className="text-zinc-600">Visitor starts a chat on your website</span>
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
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-full mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-black mb-2">
                    Try the demo widget
                  </h4>
                  <p className="text-sm text-zinc-600 mb-4">
                    Look for the chat button in the corner
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
      <section className="py-24 px-4 md:px-6 bg-zinc-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="h-px w-12 bg-zinc-300 mb-12"></div>
            <blockquote className="text-2xl md:text-3xl text-black font-medium mb-6 text-center leading-snug">
              "Cut our sales cycle by 40%. Reps only talk to people who can actually buy."
            </blockquote>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-8 rounded-full bg-zinc-200"></div>
              <div>
                <div className="text-sm font-medium text-black">Sarah Chen</div>
                <div className="text-xs text-zinc-500">Head of Sales at Linear</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-6 border-t border-zinc-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black mb-4">
            Start qualifying leads today
          </h2>
          <p className="text-zinc-600 mb-8">
            Free for up to 100 leads. No credit card required.
          </p>
          <Button size="lg" className="h-11 font-medium rounded-md px-6 shadow-none hover:shadow-sm" asChild>
            <Link href="/onboard">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

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
      
      {/* Demo Widget */}
      <DemoWidgetLoader />
    </div>
  );
}
