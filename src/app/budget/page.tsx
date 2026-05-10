import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BudgetChart from "@/components/BudgetChart";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, Plane, DollarSign } from "lucide-react";

export default async function BudgetPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const trips = await prisma.trip.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    include: {
      stops: {
        include: { activities: true }
      }
    }
  });

  // Calculate global statistics
  const allActivities = trips.flatMap(trip => trip.stops.flatMap(stop => stop.activities));
  const globalTotalCost = allActivities.reduce((sum, act) => sum + (act.cost || 0), 0);
  const averageTripCost = trips.length > 0 ? globalTotalCost / trips.length : 0;

  // Calculate individual trip costs for the list
  const tripsWithCosts = trips.map(trip => {
    const tripActivities = trip.stops.flatMap(stop => stop.activities);
    const totalCost = tripActivities.reduce((sum, act) => sum + (act.cost || 0), 0);
    return { ...trip, totalCost };
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-12">
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <Wallet className="text-brand-500" /> Global Budget
              </h1>
              <p className="text-slate-500 mt-2">Track and manage your estimated travel expenses across all your planned trips.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Planned Spend</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">${globalTotalCost.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Average Trip Cost</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">${Math.round(averageTripCost).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                  <Plane size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Trips Tracked</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{trips.length}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column: Global Chart */}
              <div className="xl:col-span-1">
                <BudgetChart activities={allActivities} />
              </div>

              {/* Right Column: Trip Cost Breakdown */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Trip Expense Breakdown</h2>
                  </div>
                  
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tripsWithCosts.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">No trips generated yet.</div>
                    ) : (
                      tripsWithCosts.map(trip => (
                        <div key={trip.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0">
                              <img src={trip.coverImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop"} alt={trip.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 dark:text-slate-200">{trip.title}</h3>
                              <p className="text-sm text-slate-500">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xl font-bold text-brand-600 dark:text-brand-400">${trip.totalCost.toLocaleString()}</p>
                            <p className="text-xs text-slate-400 font-medium">{trip.stops.length} stops</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
