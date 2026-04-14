"use client";

import { useState } from "react";

type Status = "UNUSED" | "USED" | "EXPIRED";

export default function CardInventory() {
  const [statusFilter, setStatusFilter] = useState<Status>("UNUSED");

  const statusColors = {
    UNUSED: "bg-green-600",
    USED: "bg-slate-600",
    EXPIRED: "bg-red-600",
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {(["UNUSED", "USED", "EXPIRED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === status
                ? statusColors[status] + " text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="text-slate-400 text-center py-12">
        Your card inventory will appear here
      </div>
    </div>
  );
}