"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell, Search, Menu, Plus, User, LogOut, Settings, Sparkles, Loader2, X, LogIn, MapPin } from "lucide-react";
import { WORLD_CITIES } from "@/lib/cities";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        
        {/* Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button className="md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 p-2 rounded-lg">
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex relative items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 rounded-full w-full max-w-md border border-transparent focus-within:border-brand-500/30 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length > 1) {
                  const filtered = WORLD_CITIES.filter(city => 
                    city.toLowerCase().includes(e.target.value.toLowerCase())
                  ).slice(0, 5);
                  setSuggestions(filtered);
                  setShowSuggestions(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => query.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search destinations, trips, or activities..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 py-2">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setQuery(city);
                      router.push(`/create?destination=${encodeURIComponent(city)}`);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                  >
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/create"
            className="hidden sm:flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm shadow-brand-600/20"
          >
            <Plus size={18} />
            Create Trip
          </Link>
          
          <button 
            onClick={() => alert("No new notifications")}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
          </button>

          {session ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-indigo-500 p-0.5 shadow-sm focus:outline-none"
              >
                <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-950 overflow-hidden bg-slate-200">
                  <img src={session.user?.image || "https://i.pravatar.cc/150?img=68"} alt="User" className="w-full h-full object-cover" />
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{session.user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session.user?.email}</p>
                  </div>
                  <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Settings size={16} /> Account Settings
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
              <LogIn size={16} />
              Sign In
            </Link>
          )}
        </div>
      </header>

    </>
  );
}
