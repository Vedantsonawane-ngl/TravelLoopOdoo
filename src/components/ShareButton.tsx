"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ tripId }: { tripId: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/share/${tripId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg ${
        copied ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-brand-600 hover:bg-brand-500 text-white'
      }`}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? "Copied Link!" : "Share"}
    </button>
  );
}
