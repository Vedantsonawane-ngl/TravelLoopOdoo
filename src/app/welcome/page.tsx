import Link from "next/link";
import { Compass, Sparkles, Map, Globe, Shield, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getServerSession();

  // If already logged in, skip the landing page
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-brand-500/30">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <Compass size={32} className="stroke-[2.5]" />
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Traveloop</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-lg shadow-brand-500/25">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-semibold border border-brand-100 dark:border-brand-800/50">
              <Sparkles size={16} /> Powered by Google Gemini AI
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Plan your dream trip in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">seconds.</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Traveloop uses advanced AI to instantly generate highly detailed, personalized multi-city itineraries, complete with budget estimates, drag-and-drop customization, and interactive maps.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto text-center bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2">
                Start Planning for Free <ArrowRightIcon />
              </Link>
              <a href="#features" className="w-full sm:w-auto text-center px-8 py-4 rounded-full text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                How it works
              </a>
            </div>
          </div>

          {/* Hero Image / Mockup */}
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 rounded-[3rem] blur-3xl -z-10"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop" 
                alt="Travel Preview" 
                className="w-full h-auto rounded-2xl"
              />
              {/* Floating UI Elements */}
              <div className="absolute top-10 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Map size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Kyoto, Japan</p>
                  <p className="text-xs text-slate-500">3 Days • 14 Stops</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything you need for the perfect trip</h2>
            <p className="text-slate-600 dark:text-slate-400">Say goodbye to dozens of open tabs. Traveloop handles the logistics so you can focus on the experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Zap className="text-brand-500" size={24} />}
              title="Instant AI Generation"
              description="Type a destination and our AI generates a realistic, optimized daily schedule with activities and restaurants."
            />
            <FeatureCard 
              icon={<Map className="text-indigo-500" size={24} />}
              title="Drag-and-Drop Itineraries"
              description="Plans change. Easily reorder your schedule by dragging activities between days or deleting them completely."
            />
            <FeatureCard 
              icon={<Globe className="text-emerald-500" size={24} />}
              title="Interactive Maps & Budgets"
              description="Visualize your route on live maps and automatically calculate total costs with our global financial dashboard."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-10 text-center border-t border-slate-200 dark:border-slate-800 text-slate-500">
        <p className="text-sm">Built for the Travel Hackathon • Powered by AI</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-900/50 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
