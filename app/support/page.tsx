"use client";

import { useState } from "react";
import AIChatWidget from "@/components/support/AIChatWidget";
import DisputeForm from "@/components/dispute/DisputeForm";

type Tab = "chat" | "disputes" | "geo";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <main className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Support Center</h1>

      <nav className="flex gap-4 mb-6">
        {[
          { id: "chat", label: "AI Chat" },
          { id: "disputes", label: "Disputes" },
          { id: "geo", label: "Region" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "chat" && <AIChatWidget />}
      {activeTab === "disputes" && <DisputeForm />}
      {activeTab === "geo" && <GeoRestrictionPanel />}
    </main>
  );
}

function GeoRestrictionPanel() {
  const [travelMode, setTravelMode] = useState(false);

  return (
    <div className="bg-slate-800 rounded-xl p-6 max-w-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Region Settings</h2>
      <div className="mb-4">
        <span className="text-slate-400">Detected Location: </span>
        <span className="text-white">United States</span>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={travelMode}
          onChange={(e) => setTravelMode(e.target.checked)}
          className="w-5 h-5 rounded"
        />
        <span className="text-white">Travel Mode (temporary region override)</span>
      </label>
    </div>
  );
}