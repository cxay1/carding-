"use client";

import { CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";

interface StatsGridProps {
  balance: number;
  cardsOwned: number;
  transactions: number;
  totalSpent: number;
}

export default function StatsGrid({ balance, cardsOwned, transactions, totalSpent }: StatsGridProps) {
  const stats = [
    { label: "Balance", value: `$${balance}`, icon: DollarSign, change: 0 },
    { label: "Cards Owned", value: cardsOwned.toString(), icon: CreditCard, change: 0 },
    { label: "Transactions", value: transactions.toString(), icon: TrendingUp, change: 0 },
    { label: "Total Spent", value: `$${totalSpent}`, icon: Users, change: 0 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-slate-800 rounded-xl p-4 lg:p-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm">{stat.label}</span>
            <stat.icon className="w-5 h-5 text-slate-500" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}