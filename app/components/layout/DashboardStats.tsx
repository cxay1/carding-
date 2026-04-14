"use client";

import { CreditCard, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}

interface DashboardStatsProps {
  balance: number;
  totalCards: number;
  activeCards: number;
  pendingTransactions: number;
}

export default function DashboardStats({
  balance,
  totalCards,
  activeCards,
  pendingTransactions,
}: DashboardStatsProps) {
  const stats: Stat[] = [
    { label: "Balance", value: `$${balance}`, icon: DollarSign, color: "text-green-400" },
    { label: "Total Cards", value: totalCards, icon: CreditCard, color: "text-blue-400" },
    { label: "Active Cards", value: activeCards, icon: CheckCircle, color: "text-green-400" },
    { label: "Pending", value: pendingTransactions, icon: Clock, color: "text-yellow-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-slate-800 rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">{stat.label}</span>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}