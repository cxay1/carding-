"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: any;
}

export default function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-sm">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-slate-500" />}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change !== undefined && (
          <span className={`flex items-center text-sm ${
            change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-slate-400"
          }`}>
            {change > 0 ? <TrendingUp className="w-4 h-4" /> : change < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}