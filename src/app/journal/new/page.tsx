import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import JournalEditor from "@/components/JournalEditor";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NewJournalPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch trips to populate the select dropdown
  const trips = await prisma.trip.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <JournalEditor trips={trips} />
        </main>
      </div>
    </div>
  );
}
