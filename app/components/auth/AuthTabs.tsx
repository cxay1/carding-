"use client";

import { useState } from "react";

interface AuthTabsProps {
  activeTab: "signin" | "signup";
  onTabChange: (tab: "signin" | "signup") => void;
}

export default function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onTabChange("signin")}
        className={`flex-1 py-2 rounded-lg transition ${
          activeTab === "signin"
            ? "bg-primary-600 text-white"
            : "bg-slate-700 text-slate-300"
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onTabChange("signup")}
        className={`flex-1 py-2 rounded-lg transition ${
          activeTab === "signup"
            ? "bg-primary-600 text-white"
            : "bg-slate-700 text-slate-300"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}