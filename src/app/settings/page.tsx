import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { User, Globe, Mail, Shield, Save } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch the real user from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) {
    redirect("/login");
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español (Spanish)" },
    { code: "fr", name: "Français (French)" },
    { code: "de", name: "Deutsch (German)" },
    { code: "ja", name: "日本語 (Japanese)" }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto pb-12 space-y-8">
            
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>
              <p className="text-slate-500 mt-1">Manage your account preferences and application settings.</p>
            </div>

            <div className="grid gap-8">
              
              {/* Account Information Section */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <User size={20} className="text-brand-500" />
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Account Information</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-200">
                        <img 
                          src={user.image || "https://i.pravatar.cc/150?img=68"} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
                        Change Picture
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                          <input 
                            type="text" 
                            defaultValue={user.name || ""} 
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Mail size={14} className="text-slate-400"/> Email Address
                          </label>
                          <input 
                            type="email" 
                            defaultValue={user.email || ""} 
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                          <Save size={16} /> Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Preferences Section */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <Globe size={20} className="text-brand-500" />
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Language Preferences</h2>
                </div>
                
                <div className="p-6">
                  <div className="max-w-md space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Select the primary language for your Traveloop interface and AI generations.
                    </p>
                    
                    <div className="relative">
                      <select className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium">
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Section (Bonus) */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <Shield size={20} className="text-brand-500" />
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Security</h2>
                </div>
                
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Password</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">You last changed your password 3 months ago.</p>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Update Password
                  </button>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
