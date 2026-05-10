import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch trips dynamically from the database for the logged in user
  const trips = await prisma.trip.findMany({
    where: {
      user: { email: session.user.email }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      stops: {
        orderBy: { order: 'asc' }
      }
    }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Dashboard initialTrips={trips} />
        </main>
      </div>
    </div>
  );
}
