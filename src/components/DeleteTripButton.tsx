"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteTripButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the trip page
    
    if (!confirm("Are you sure you want to delete this trip? This cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete trip");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg backdrop-blur-sm transition-colors border border-transparent hover:border-red-200 shadow-sm disabled:opacity-50"
      title="Delete Trip"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
