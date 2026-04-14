"use client";

import { useState } from "react";

interface TransactionChartProps {
  data: { date: string; amount: number }[];
}

export default function TransactionChart({ data }: TransactionChartProps) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const maxAmount = Math.max(...data.map(d => d.amount), 1);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Spending History</h3>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-sm ${
                period === p ? "bg-primary-600 text-white" : "text-slate-400"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 flex items-end gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-primary-600 rounded-t"
              style={{ height: `${(item.amount / maxAmount) * 100}%` }}
            />
            <span className="text-xs text-slate-500">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}