"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, TrendingUp, Sparkles, ArrowRight, Clock, Loader2 } from "lucide-react";
import { WORLD_CITIES } from "@/lib/cities";

export default function Dashboard({ initialTrips = [] }: { initialTrips?: any[] }) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    router.push(`/create?destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-10 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000&auto=format&fit=crop" 
            alt="Travel Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ready for your next adventure?
            </h2>
            <p className="text-slate-300 max-w-xl text-lg">
              Let our AI travel assistant craft the perfect itinerary for your dream destination in seconds.
            </p>
          </div>
          
          <form onSubmit={handleGenerateTrip} className="relative flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-full shadow-lg self-start md:self-auto w-full md:w-auto border border-white/20">
            <div className="flex items-center gap-2 pl-4 pr-2 text-white flex-1 md:flex-initial">
              <MapPin size={20} className="text-brand-400" />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  if (e.target.value.length > 1) {
                    const filtered = WORLD_CITIES.filter(city => 
                      city.toLowerCase().includes(e.target.value.toLowerCase())
                    ).slice(0, 5);
                    setSuggestions(filtered);
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => destination.length > 1 && setShowSuggestions(true)}
                placeholder="Where to? (e.g. Tokyo)" 
                className="bg-transparent border-none outline-none text-white placeholder:text-white/60 w-full md:w-48 font-medium"
                disabled={isGenerating}
              />
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setDestination(city);
                      setShowSuggestions(false);
                      router.push(`/create?destination=${encodeURIComponent(city)}`);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                  >
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{city}</span>
                  </button>
                ))}
              </div>
            )}

            <button 
              type="submit"
              disabled={isGenerating || !destination}
              className="flex items-center gap-2 bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-brand-50 transition-colors disabled:opacity-50 shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin text-brand-600" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-brand-500" />
                  Generate
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Upcoming Trips" value="2" icon={Calendar} color="bg-blue-500" />
        <StatCard title="Countries Visited" value="12" icon={MapPin} color="bg-indigo-500" />
        <StatCard title="Total Budget Saved" value="$450" icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Days Traveling" value="48" icon={Clock} color="bg-amber-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Upcoming Trips</h3>
              <Link href="/trips" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline">View All</Link>
            </div>
            
            <div className="grid gap-6">
              {initialTrips.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 font-medium">No trips generated yet.</p>
                  <p className="text-sm text-slate-400 mt-1">Use the AI generator above to plan your first adventure!</p>
                </div>
              ) : (
                initialTrips.map((trip) => (
                  <Link href={`/trip/${trip.id}`} key={trip.id}>
                    <TripCard 
                      title={trip.title} 
                      date={`${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}`}
                      destinations={trip.stops.map((s: any) => s.city)}
                      image={trip.coverImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop"}
                      progress={100}
                    />
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          {/* AI Suggestions Box */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-100 dark:bg-brand-900/50 rounded-xl">
                <Sparkles size={20} className="text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">AI Suggestions</h3>
            </div>
            <div className="space-y-4">
              <Link 
                href="/create/weekend"
                className="group relative block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Weekend Getaways</h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Plan a perfect 48-hour escape near your location with zero effort.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                  Try it now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </section>
        </div>
        
      </div>
    </div>
  );
}

// Subcomponents

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl text-white ${color} shadow-lg`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TripCard({ title, date, destinations, image, progress }: any) {
  return (
    <div className="group flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="sm:w-64 h-48 sm:h-auto overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800">
          {destinations.length} Stops
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{title}</h4>
        </div>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">{date}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {destinations.map((dest: string) => (
            <span key={dest} className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
              {dest}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-500 font-medium">Planning Progress</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-brand-500 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
