import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DeleteTripButton from "@/components/DeleteTripButton";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Plane, Calendar, MapPin, Sparkles } from "lucide-react";

export default async function MyTripsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const trips = await prisma.trip.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    include: {
      stops: true
    }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-12">
            
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                  <Plane className="text-brand-500" /> My Trips
                </h1>
                <p className="text-slate-500 mt-2">Manage and view all your generated itineraries.</p>
              </div>
              <Link 
                href="/create"
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
              >
                <Sparkles size={18} />
                Generate New Trip
              </Link>
            </div>

            {trips.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
                <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-500">
                  <Plane size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No trips yet</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't generated any trips. Use the AI generator to plan your first adventure!</p>
                <Link 
                  href="/create"
                  className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full text-sm font-semibold transition-colors"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trips.map(trip => {
                  const destinations = Array.from(new Set(trip.stops.map(s => s.city)));
                  const startDateStr = new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const endDateStr = new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  
                  return (
                    <div key={trip.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative">
                      
                      <Link href={`/trip/${trip.id}`} className="block relative h-56 overflow-hidden">
                        <img 
                          src={trip.coverImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop"} 
                          alt={trip.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-brand-300 transition-colors">{trip.title}</h3>
                          <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {startDateStr} - {endDateStr}</span>
                          </div>
                        </div>
                      </Link>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {destinations.slice(0, 3).map((dest: string) => (
                            <span key={dest} className="text-xs font-semibold px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-md border border-brand-100 dark:border-brand-800">
                              <MapPin size={10} className="inline mr-1" />{dest}
                            </span>
                          ))}
                          {destinations.length > 3 && (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                              +{destinations.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                          <Link href={`/trip/${trip.id}`} className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                            View Itinerary &rarr;
                          </Link>
                          
                          {/* Delete Button Component */}
                          <DeleteTripButton tripId={trip.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
