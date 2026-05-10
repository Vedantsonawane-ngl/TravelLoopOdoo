"use client";

import { Home, Map, Plane, Wallet, Book, Compass, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Plane, label: "My Trips", href: "/trips" },
    { icon: Map, label: "Discover", href: "/discover" },
    { icon: Wallet, label: "Budget", href: "/budget" },
    { icon: Book, label: "Journal", href: "/journal" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-10 text-brand-600 dark:text-brand-400">
        <Compass size={32} className="stroke-[2.5]" />
        <h1 className="text-2xl font-bold tracking-tight">Traveloop</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`) && item.href !== "/";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <item.icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-2"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
