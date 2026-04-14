"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Menu, X, LayoutDashboard, ShoppingCart, CreditCard, Headphones, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard?tab=buy", label: "Buy Cards", icon: ShoppingCart },
  { href: "/dashboard?tab=mycards", label: "My Cards", icon: CreditCard },
  { href: "/support", label: "Support", icon: Headphones },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-800 p-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-white">ChargeLine</h1>
            <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  pathname === item.href ? "bg-primary-600 text-white" : "text-slate-300 hover:bg-slate-700"
                }`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">ChargeLine</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                pathname === item.href ? "bg-primary-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="text-slate-400 text-sm">{user?.emailAddresses[0]?.emailAddress}</div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="lg:hidden bg-slate-800 p-4 flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white ml-4">ChargeLine</h1>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}