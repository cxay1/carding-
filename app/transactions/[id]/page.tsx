"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, RefreshCw, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TransactionDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "txn_123";
  const [refunding, setRefunding] = useState(false);

  const transaction = {
    id,
    amount: 50,
    currency: "USD",
    gateway: "stripe",
    gatewayRef: "pi_3Oxxx",
    status: "COMPLETED" as const,
    paymentMethod: "Visa •••• 4242",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:31:00Z",
    card: {
      id: "card_1",
      denomination: 50,
      region: "US",
      brand: "Amazon",
    },
    user: {
      email: "user@example.com",
    },
  };

  const statusConfig = {
    PENDING: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Pending" },
    COMPLETED: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", label: "Completed" },
    FAILED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Failed" },
    REFUNDED: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-400/10", label: "Refunded" },
  };

  const config = statusConfig[transaction.status];
  const Icon = config.icon;

  const handleRefund = async () => {
    setRefunding(true);
    await new Promise(r => setTimeout(r, 2000));
    setRefunding(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Transaction Details</h1>
        </div>

        {/* Status Card */}
        <div className={`${config.bg} rounded-xl p-6 mb-6`}>
          <div className="flex items-center gap-4">
            <Icon className={`w-10 h-10 ${config.color}`} />
            <div>
              <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
              <p className="text-slate-400">
                ${transaction.amount} {transaction.currency}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Transaction Info</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-slate-700">
              <span className="text-slate-400">Transaction ID</span>
              <span className="text-white font-mono">{transaction.id}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-700">
              <span className="text-slate-400">Date</span>
              <span className="text-white">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-700">
              <span className="text-slate-400">Payment Method</span>
              <span className="text-white">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-700">
              <span className="text-slate-400">Gateway</span>
              <span className="text-white capitalize">{transaction.gateway}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-700">
              <span className="text-slate-400">Reference</span>
              <span className="text-white font-mono text-sm">{transaction.gatewayRef}</span>
            </div>
          </div>

          {/* Gift Card Info */}
          <h2 className="text-lg font-semibold text-white pt-4">Gift Card</h2>
          <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-primary-400" />
              <div>
                <p className="text-white font-medium">{transaction.card.brand}</p>
                <p className="text-slate-400 text-sm">${transaction.card.denomination} {transaction.card.region}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
              {transaction.status === "COMPLETED" ? "Delivered" : transaction.status}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            {transaction.status === "COMPLETED" && (
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refunding ? "animate-spin" : ""}`} />
                {refunding ? "Processing..." : "Request Refund"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}