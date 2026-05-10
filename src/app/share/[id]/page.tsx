import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Compass, DollarSign } from "lucide-react";
import BudgetChart from "@/components/BudgetChart";

export default async function SharedTripPage({ params }: { params: { id: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: { activities: true }
      }
    }
  });

  if (!trip) {
    return notFound();
  }

  // Format dates
  const startDateStr = trip.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const endDateStr = trip.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const locations = Array.from(new Set(trip.stops.map(s => s.city))).join(", ");
  const allActivities = trip.stops.flatMap(stop => stop.activities);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Minimal Header */}
      <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <Compass size={24} className="stroke-[2.5]" />
          <h1 className="text-xl font-bold tracking-tight">Traveloop</h1>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          Public Read-Only View
        </div>
      </header>

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
                  <span className="flex items-center gap-1 text-sm font-medium text-slate-200">
                    <Calendar size={14} /> {startDateStr} - {endDateStr}
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">{trip.title}</h1>
                <p className="flex items-center gap-2 text-slate-300 font-medium">
                  <MapPin size={16} className="text-brand-400" /> {locations}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Static Itinerary */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Trip Itinerary</h2>
              
              <div className="space-y-6">
                {trip.stops.map((stop, index) => (
                  <div key={stop.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
                      <div className="bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-400 font-bold px-3 py-1.5 rounded-lg text-sm">
                        Day {index + 1}
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white">{stop.city}, {stop.country}</h3>
                    </div>

                    <div className="p-4 space-y-3">
                      {stop.activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{activity.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                                {activity.category}
                              </span>
                              {activity.description && (
                                <span className="text-xs text-slate-500 truncate max-w-xs">{activity.description}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium text-sm px-4">
                            <DollarSign size={14} className="text-emerald-500" />
                            {activity.cost || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Budget */}
            <div className="space-y-6">
              <BudgetChart activities={allActivities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
