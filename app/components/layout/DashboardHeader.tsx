"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  balance: number;
}

export default function DashboardHeader({ balance }: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold text-white">ChargeLine</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <span className="text-slate-400 text-sm">Balance: </span>
            <span className="text-white font-medium">${balance}</span>
          </div>
          
          <button className="text-slate-400 hover:text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <UserButton 
            afterSignOutUrl="/auth"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-slate-700 p-4 space-y-4">
          <div className="sm:hidden">
            <span className="text-slate-400">Balance: </span>
            <span className="text-white font-medium">${balance}</span>
          </div>
        </div>
      )}
    </header>
  );
}