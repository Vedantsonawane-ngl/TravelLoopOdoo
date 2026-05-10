"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Compass, MapPin, Sparkles, Wallet, Calendar, Loader2, Music, Coffee, Palmtree, Utensils, Mountain } from "lucide-react";

const INTEREST_OPTIONS = [
  { id: "Food", icon: Utensils, label: "Foodie" },
  { id: "Nature", icon: Palmtree, label: "Nature" },
  { id: "Culture", icon: Music, label: "Culture" },
  { id: "Relax", icon: Coffee, label: "Relaxing" },
  { id: "Adventure", icon: Mountain, label: "Adventure" },
];

export default function WeekendGetawayPage() {
  const router = useRouter();
  const [currentCity, setCurrentCity] = useState("");
  const [budget, setBudget] = useState("Standard");
  const [interests, setInterests] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCity) return;

    setIsGenerating(true);
    
    // Simulate finding a nearby city based on the current city
    const nearbyDestinations: Record<string, string> = {
      "New York": "Philadelphia, PA",
      "London": "Oxford, UK",
      "Paris": "Lyon, France",
      "Tokyo": "Kyoto, Japan",
      "Mumbai": "Lonavala, India",
      "Delhi": "Jaipur, India"
    };

    const destination = nearbyDestinations[currentCity] || `a scenic spot near ${currentCity}`;
    
    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          destination, 
          duration: 2, 
          budget, 
          style: interests.join(", ") || "Balanced" 
        }),
      });
      
      const data = await response.json();
      if (data.success && data.tripId) {
        router.push(`/trip/${data.tripId}`);
      } else {
        alert("Failed to generate weekend getaway");
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
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles size={40} className="text-brand-500" />
              </div>
              <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Escaping the City...</h2>
            <p className="text-slate-500 max-w-md">Our AI is finding the perfect 2-day escape near {currentCity} based on your interests.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto py-10">
            
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold mb-4 uppercase tracking-wider">
                <Sparkles size={14} /> AI Powered Express
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Weekend Getaway Generator</h1>
              <p className="text-slate-500 text-lg">Tell us where you are, and we'll plan a perfect 48-hour escape.</p>
            </div>

            <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-200 dark:border-slate-800 space-y-10">
              
              {/* Current Location */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPin size={18} className="text-brand-500" /> Where are you currently?
                </label>
                <input 
                  type="text" 
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="e.g., London, New York, Mumbai" 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-lg outline-none focus:border-brand-500 transition-all"
                />
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Compass size={18} className="text-brand-500" /> What's the vibe?
                </label>
                <div className="flex flex-wrap gap-3">
                  {INTEREST_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 font-bold transition-all ${
                        interests.includes(opt.id)
                          ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/30"
                          : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-200"
                      }`}
                    >
                      <opt.icon size={18} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Wallet size={18} className="text-brand-500" /> Weekend Budget
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["Economy", "Standard", "Luxury"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`py-4 rounded-2xl border-2 font-bold transition-all ${
                        budget === b
                          ? "bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-300"
                          : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-500"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={!currentCity}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-brand-500/40 flex items-center justify-center gap-3"
                >
                  <Sparkles size={24} /> Generate 48h Escape
                </button>
              </div>

            </form>

          </div>
        </main>
      </div>
    </div>
  );
}
