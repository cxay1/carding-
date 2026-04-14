"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import CardGrid from "@/components/cards/CardGrid";
import CardInventory from "@/components/cards/CardInventory";
import RedeemForm from "@/components/cards/RedeemForm";

type Tab = "buy" | "mycards" | "redeem" | "history";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("buy");
  const [regionFilter, setRegionFilter] = useState<"US" | "NG" | "ALL">("ALL");

  const tabs: { id: Tab; label: string }[] = [
    { id: "buy", label: "Buy Cards" },
    { id: "mycards", label: "My Cards" },
    { id: "redeem", label: "Redeem" },
    { id: "history", label: "History" },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Please sign in to access dashboard</div>
      </div>
    );
  }

  const balance = user.publicMetadata?.balance as number | undefined;

  return (
    <main className="min-h-screen bg-slate-900">
      <header className="p-6 bg-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-slate-400">
          Balance: ${balance ?? 0}
        </div>
      </header>

      <nav className="flex gap-4 p-4 bg-slate-800/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        {activeTab === "buy" && (
          <CardGrid regionFilter={regionFilter} setRegionFilter={setRegionFilter} />
        )}
        {activeTab === "mycards" && <CardInventory />}
        {activeTab === "redeem" && <RedeemForm />}
        {activeTab === "history" && (
          <div className="text-slate-400 text-center py-12">
            Transaction history coming soon
          </div>
        )}
      </div>
    </main>
  );
}