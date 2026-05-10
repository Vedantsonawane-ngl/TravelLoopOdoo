"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Compass, MapPin, Loader2, Sparkles } from "lucide-react";

// Curated Destination Dataset
const DESTINATIONS = [
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    description: "Experience the magic of ancient temples, tranquil bamboo groves, and modern neon streets.",
    tags: ["Culture", "Nature", "Food"],
    budget: "$$$"
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop",
    description: "Iconic white-washed buildings and breathtaking sunsets over the Aegean Sea.",
    tags: ["Romantic", "Beach", "Luxury"],
    budget: "$$$$"
  },
  {
    id: "banff",
    name: "Banff National Park",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1603953509176-508baf6c1f88?q=80&w=800&auto=format&fit=crop",
    description: "Crystal clear turquoise lakes surrounded by the majestic Rocky Mountains.",
    tags: ["Adventure", "Nature", "Hiking"],
    budget: "$$"
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=800&auto=format&fit=crop",
    description: "A vibrant collision of colors, spices, and historic souks in the Medina.",
    tags: ["Culture", "Shopping", "Food"],
    budget: "$"
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1533659223709-b4ecfb041dc5?q=80&w=800&auto=format&fit=crop",
    description: "Dramatic cliffside villages, lemon groves, and incredible Italian cuisine.",
    tags: ["Coastal", "Food", "Scenic"],
    budget: "$$$"
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    description: "Lush rice terraces, spiritual retreats, and world-class surfing beaches.",
    tags: ["Tropical", "Wellness", "Beach"],
    budget: "$"
  },
  {
    id: "patagonia",
    name: "Patagonia",
    country: "Argentina & Chile",
    image: "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?q=80&w=800&auto=format&fit=crop",
    description: "The ultimate wilderness of glaciers, jagged peaks, and endless steppes.",
    tags: ["Wilderness", "Trekking", "Nature"],
    budget: "$$$"
  },
  {
    id: "newyork",
    name: "New York City",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop",
    description: "The city that never sleeps, offering endless culture, art, and towering skyscrapers.",
    tags: ["Urban", "Art", "Nightlife"],
    budget: "$$$$"
  }
];

export default function DiscoverPage() {
  const router = useRouter();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerateTrip = (destination: string) => {
    router.push(`/create?destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-12">
            
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <Compass className="text-brand-500" size={36} /> Discover
              </h1>
              <p className="text-slate-500 mt-3 text-lg max-w-2xl">
                Explore our curated collection of world-class destinations. Click on any location to instantly generate a personalized AI itinerary.
              </p>
            </div>

            {/* Masonry Grid UI */}
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {DESTINATIONS.map((dest) => (
                <div 
                  key={dest.id} 
                  className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    if (!generatingId) {
                      handleGenerateTrip(`${dest.name}, ${dest.country}`, dest.id);
                    }
                  }}
                >
                  {/* Image Background */}
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 shadow-sm">
                        {dest.budget}
                      </div>
                      <div className="bg-white/20 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center text-white border border-white/30 shadow-sm group-hover:bg-brand-500 group-hover:border-brand-500 transition-colors">
                        <MapPin size={16} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">{dest.name}</h3>
                      <p className="text-white/80 text-sm font-medium mb-3">{dest.country}</p>
                      
                      <p className="text-white/70 text-xs leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {dest.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {dest.tags.map(tag => (
                          <span key={tag} className="bg-black/30 backdrop-blur-sm text-white/90 text-[10px] px-2 py-1 rounded-md border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Loading State Overlay */}
                  {generatingId === dest.id && (
                    <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
                      <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
                      <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <Sparkles size={20} className="text-brand-300" />
                        Generating Trip...
                      </div>
                      <p className="text-brand-200 text-sm mt-2 text-center px-6">
                        Our AI is building your custom itinerary for {dest.name}.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
