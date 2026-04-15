"use client";

import { useState } from "react";
import { Users, CreditCard, DollarSign, TrendingUp, AlertTriangle, Shield, Settings, BarChart3, UserPlus, Gift } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, change: "+12%" },
    { label: "Active Cards", value: "5,678", icon: Gift, change: "+8%" },
    { label: "Revenue", value: "$45,678", icon: DollarSign, change: "+23%" },
    { label: "Disputes", value: "12", icon: AlertTriangle, change: "-5%" },
  ];

  const recentUsers = [
    { id: "1", name: "John Doe", email: "john@example.com", joined: "2024-01-15", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", joined: "2024-01-14", status: "active" },
    { id: "3", name: "Bob Wilson", email: "bob@example.com", joined: "2024-01-13", status: "suspended" },
  ];

  const recentTransactions = [
    { id: "txn_001", user: "john@example.com", amount: 50, status: "completed" },
    { id: "txn_002", user: "jane@example.com", amount: 100, status: "completed" },
    { id: "txn_003", user: "bob@example.com", amount: 25, status: "failed" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: UserPlus },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "disputes", label: "Disputes", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">Admin</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <nav className="lg:col-span-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === tab.id
                    ? "bg-primary-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-800 rounded-xl p-4 lg:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-400 text-sm">{stat.label}</span>
                        <stat.icon className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</span>
                        <span className="text-green-400 text-sm">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Users */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Recent Users</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 text-slate-400 text-sm">Name</th>
                          <th className="text-left py-3 text-slate-400 text-sm">Email</th>
                          <th className="text-left py-3 text-slate-400 text-sm">Joined</th>
                          <th className="text-left py-3 text-slate-400 text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-slate-700/50">
                            <td className="py-3 text-white">{user.name}</td>
                            <td className="py-3 text-slate-400">{user.email}</td>
                            <td className="py-3 text-slate-400">{user.joined}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === "active" 
                                  ? "bg-green-600/20 text-green-400" 
                                  : "bg-red-600/20 text-red-400"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
                  <div className="space-y-3">
                    {recentTransactions.map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <p className="text-white font-mono text-sm">{txn.id}</p>
                          <p className="text-slate-400 text-sm">{txn.user}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${txn.amount}</p>
                          <span className={`text-xs ${
                            txn.status === "completed" ? "text-green-400" : "text-red-400"
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">User Management</h2>
                <p className="text-slate-400">User management panel...</p>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">All Transactions</h2>
                <p className="text-slate-400">Transaction management panel...</p>
              </div>
            )}

            {activeTab === "disputes" && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Dispute Management</h2>
                <p className="text-slate-400">Dispute management panel...</p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">System Settings</h2>
                <p className="text-slate-400">System settings panel...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}