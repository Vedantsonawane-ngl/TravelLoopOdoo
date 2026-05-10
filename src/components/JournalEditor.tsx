"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JournalEditor({ trips }: { trips: any[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tripId, setTripId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tripId: tripId || null }),
      });

      if (!res.ok) {
        throw new Error("Failed to save entry");
      }

      router.push("/journal");
      router.refresh();
    } catch (err) {
      setError("Something went wrong while saving your entry.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <Link href="/journal" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Journal
        </Link>
        <button 
          onClick={handleSave}
          disabled={isSaving || !title || !content}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? "Saving..." : "Save Entry"}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Editor Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="An Unforgettable Day in..."
            className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 mb-6"
          />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <MapPin size={16} />
              <select 
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className="bg-transparent border-none outline-none text-sm cursor-pointer appearance-none pr-4"
              >
                <option value="">No trip selected</option>
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>{trip.title}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-slate-400">
              {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 p-6 md:p-8">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your memories here..."
            className="w-full h-full min-h-[400px] resize-none bg-transparent border-none outline-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
