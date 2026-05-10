"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Sparkles, MapPin, CalendarDays, Wallet, Compass, Loader2 } from "lucide-react";

const BUDGET_OPTIONS = [
  { id: "Economy", label: "Economy", desc: "Hostels, street food, public transit" },
  { id: "Standard", label: "Standard", desc: "3-star hotels, nice restaurants, taxis" },
  { id: "Luxury", label: "Luxury", desc: "5-star resorts, fine dining, private cars" },
];

const STYLE_OPTIONS = [
  { id: "Balanced", label: "Balanced", emoji: "⚖️" },
  { id: "Adventure", label: "Adventure", emoji: "🧗‍♂️" },
  { id: "Relaxing", label: "Relaxing", emoji: "🏖️" },
  { id: "Cultural", label: "Cultural", emoji: "🏛️" },
  { id: "Foodie", label: "Foodie", emoji: "🍜" },
];

function TripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("Standard");
  const [style, setStyle] = useState("Balanced");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest) setDestination(dest);
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, duration, budget, style }),
      });
      
      const data = await response.json();
      if (data.success && data.tripId) {
        router.push(`/trip/${data.tripId}`);
      } else {
        alert(data.error || "Failed to generate trip");
        setIsGenerating(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles size={40} className="text-brand-500 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Designing Your Perfect Trip...</h2>
          <p className="text-slate-500 dark:text-slate-400">Our AI is analyzing thousands of data points to build a highly optimized {duration}-day {budget.toLowerCase()} itinerary for {destination}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">Create Your Journey</h1>
        <p className="text-slate-500 text-lg">Tell us your preferences and let our AI handle the logistics.</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Destination */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin size={18} className="text-brand-500" /> Where do you want to go?
          </label>
          <input 
            type="text" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Tokyo, Japan or Paris & London" 
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-lg text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CalendarDays size={18} className="text-brand-500" /> How many days? ({duration} Days)
          </label>
          <input 
            type="range" 
            min="1" 
            max="7" 
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full accent-brand-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>1 Day</span>
            <span>7 Days</span>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Wallet size={18} className="text-brand-500" /> What is your budget?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBudget(opt.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  budget === opt.id 
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" 
                    : "border-slate-100 dark:border-slate-800 bg-transparent hover:border-brand-200 dark:hover:border-slate-700"
                }`}
              >
                <h4 className={`font-bold mb-1 ${budget === opt.id ? "text-brand-700 dark:text-brand-300" : "text-slate-700 dark:text-slate-300"}`}>
                  {opt.label}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Compass size={18} className="text-brand-500" /> Travel Style
          </label>
          <div className="flex flex-wrap gap-3">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStyle(opt.id)}
                className={`px-5 py-3 rounded-full border-2 text-sm font-bold transition-all flex items-center gap-2 ${
                  style === opt.id 
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300" 
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-transparent hover:border-brand-200"
                }`}
              >
                <span>{opt.emoji}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit" 
            disabled={!destination}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl text-lg font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-brand-500/25"
          >
            <Sparkles size={24} /> Generate Magic Itinerary
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreateTripPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-500 w-10 h-10" /></div>}>
            <TripForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
