"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Download, RotateCcw, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  total: number;
  currency: string;
  status: string;
  itemCount: number;
  createdAt: string;
}

const mockOrders: Order[] = [
  { id: "bulk_001", total: 250, currency: "USD", status: "COMPLETED", itemCount: 5, createdAt: "2024-01-15T10:30:00Z" },
  { id: "bulk_002", total: 100, currency: "USD", status: "PENDING", itemCount: 2, createdAt: "2024-01-14T15:20:00Z" },
  { id: "bulk_003", total: 500, currency: "USD", status: "COMPLETED", itemCount: 10, createdAt: "2024-01-10T09:00:00Z" },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const statusConfig = {
    PENDING: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    COMPLETED: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
    FAILED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  };

  const filtered = filter === "all" 
    ? mockOrders 
    : mockOrders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Bulk Orders</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "PENDING", "COMPLETED", "FAILED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filtered.map(order => {
            const config = statusConfig[order.status as keyof typeof statusConfig];
            const Icon = config?.icon || Clock;

            return (
              <div key={order.id} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{order.id}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${config?.bg} ${config?.color}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {new Date(order.createdAt).toLocaleString()} • {order.itemCount} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${order.total}</p>
                    <p className="text-slate-400 text-sm">{order.currency}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm">
                    <Download className="w-4 h-4" />
                    Invoice
                  </button>
                  {order.status === "COMPLETED" && (
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm">
                      <RotateCcw className="w-4 h-4" />
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}