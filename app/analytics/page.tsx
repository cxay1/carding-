"use client";

import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, Gift, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalyticsPage() {
  const period = "30d";
  
  const metrics = [
    { 
      label: "Total Revenue", 
      value: "$45,678", 
      change: 23.5, 
      icon: DollarSign,
      trend: "up" as const 
    },
    { 
      label: "Total Users", 
      value: "1,234", 
      change: 12.3, 
      icon: Users,
      trend: "up" as const 
    },
    { 
      label: "Cards Sold", 
      value: "5,678", 
      change: 8.2, 
      icon: Gift,
      trend: "up" as const 
    },
    { 
      label: "Avg Order Value", 
      value: "$38.50", 
      change: -2.1, 
      icon: CreditCard,
      trend: "down" as const 
    },
  ];

  const topCards = [
    { brand: "Amazon", sales: 1250, revenue: 62500 },
    { brand: "Steam", sales: 890, revenue: 22250 },
    { brand: "Netflix", sales: 678, revenue: 33900 },
    { brand: "Spotify", sales: 456, revenue: 11400 },
    { brand: "Apple", sales: 345, revenue: 34500 },
  ];

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    revenue: Math.floor(Math.random() * 2000) + 500,
    orders: Math.floor(Math.random() * 50) + 10,
  }));

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
            <option value="7d">Last 7 days</option>
            <option value="30d" selected>Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-slate-400 text-sm">{metric.label}</span>
                <metric.icon className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white">{metric.value}</span>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === "up" ? "text-green-400" : "text-red-400"
                }`}>
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h2>
          <div className="h-64 flex items-end gap-1">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary-600 rounded-t"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                  title={`$${data.revenue}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Cards */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Selling Cards</h2>
            <div className="space-y-4">
              {topCards.map((card, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white text-sm">
                      {i + 1}
                    </span>
                    <span className="text-white">{card.brand}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{card.sales} sold</p>
                    <p className="text-slate-400 text-sm">${card.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Stats */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">User Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-400">New Users (30d)</span>
                <span className="text-white font-medium">234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-400">Active Users</span>
                <span className="text-white font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-400">Returning Users</span>
                <span className="text-white font-medium">67%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-400">Avg. Sessions/Week</span>
                <span className="text-white font-medium">3.2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}