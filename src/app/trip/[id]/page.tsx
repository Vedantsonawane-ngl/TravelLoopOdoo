import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Users, Share2, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DraggableItinerary from "@/components/DraggableItinerary";
import BudgetChart from "@/components/BudgetChart";
import ShareButton from "@/components/ShareButton";
import TripExport from "@/components/TripExport";
import BudgetOptimizer from "@/components/BudgetOptimizer";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

export default async function TripItineraryPage({ params }: { params: { id: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: {
          activities: true
        }
      }
    }
  });

  if (!trip) {
    return notFound();
  }

  // Format dates
  const startDateStr = trip.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const endDateStr = trip.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  
  // Aggregate locations
  const locations = Array.from(new Set(trip.stops.map(s => s.city))).join(", ");

  // Get all activities for the budget chart
  const allActivities = trip.stops.flatMap(stop => stop.activities);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-5xl mx-auto pb-12">
            
            {/* Trip Header Banner */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-64 shadow-lg group">
              <img 
                src={trip.coverImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop"} 
                alt={trip.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                <div className="text-white space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-brand-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Upcoming
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-slate-200">
                      <Calendar size={14} /> {startDateStr} - {endDateStr}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight">{trip.title}</h1>
                  <p className="flex items-center gap-2 text-slate-300 font-medium">
                    <MapPin size={16} className="text-brand-400" /> {locations}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <BudgetOptimizer tripId={trip.id} />
                  <TripExport trip={trip} />
                  <ShareButton tripId={trip.id} />
                </div>
              </div>
            </div>

            {/* Description */}
            {trip.description && (
              <p className="text-slate-600 dark:text-slate-300 mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed">
                {trip.description}
              </p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Itinerary */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Trip Itinerary</h2>
                  <button className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:bg-brand-50 dark:hover:bg-brand-900/30 px-4 py-2 rounded-xl transition-colors">
                    <Plus size={18} /> Add Day
                  </button>
                </div>
                <DraggableItinerary initialStops={trip.stops} />
              </div>

              {/* Right Column: Maps, Budget & Stats */}
              <div className="space-y-6">
                <TripMap activities={allActivities} city={trip.stops[0]?.city || "Destination"} />
                <BudgetChart activities={allActivities} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
