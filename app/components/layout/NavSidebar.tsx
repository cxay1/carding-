"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  ShoppingCart, 
  Headphones,
  Settings,
  LogOut
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard?tab=buy", label: "Buy Cards", icon: ShoppingCart },
  { href: "/dashboard?tab=mycards", label: "My Cards", icon: CreditCard },
  { href: "/support", label: "Support", icon: Headphones },
];

export default function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">ChargeLine</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href.includes("?") && pathname === item.href.split("?")[0]);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive 
                  ? "bg-primary-600 text-white" 
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        
        <SignOutButton>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}