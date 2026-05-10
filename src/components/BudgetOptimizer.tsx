"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Loader2, Sparkles, CheckCircle } from "lucide-react";

export default function BudgetOptimizer({ tripId }: { tripId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (searchParams.get("optimize") === "true") {
      handleOptimize();
    }
  }, [searchParams]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setIsDone(false);
    
    try {
      const response = await fetch(`/api/trips/${tripId}/optimize`, {
        method: "POST",
      });
      
      if (response.ok) {
        setIsDone(true);
        setTimeout(() => {
          setIsOptimizing(false);
          setIsDone(false);
          router.replace(`/trip/${tripId}`); // Remove the query param
          router.refresh();
        }, 2000);
      } else {
        alert("Failed to optimize budget");
        setIsOptimizing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setIsOptimizing(false);
    }
  };

  if (isOptimizing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 dark:border-slate-800">
          {isDone ? (
            <div className="space-y-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Budget Optimized!</h2>
              <p className="text-slate-500">We found 20% savings across your entire trip. Refreshing your itinerary...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-brand-100 dark:bg-brand-900/30 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={32} className="text-brand-600 animate-bounce" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Analyzing Expenses...</h2>
                <div className="space-y-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2 justify-center"><Sparkles size={14} className="text-brand-500" /> Finding local alternatives</p>
                  <p className="flex items-center gap-2 justify-center"><Sparkles size={14} className="text-brand-500" /> Checking transit shortcuts</p>
                  <p className="flex items-center gap-2 justify-center"><Sparkles size={14} className="text-brand-500" /> Reducing accommodation overhead</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleOptimize}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
    >
      <Zap size={18} />
      Optimize Budget
    </button>
  );
}
