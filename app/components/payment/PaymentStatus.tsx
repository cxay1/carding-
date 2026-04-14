"use client";

import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface PaymentStatusProps {
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  amount: number;
  currency: string;
  gatewayRef?: string;
  timestamp?: string;
}

export default function PaymentStatus({
  status,
  amount,
  currency,
  gatewayRef,
  timestamp,
}: PaymentStatusProps) {
  const symbol = currency === "USD" ? "$" : "₦";

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      label: "Pending",
    },
    processing: {
      icon: Loader2,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      label: "Processing",
    },
    completed: {
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
      label: "Completed",
    },
    failed: {
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      label: "Failed",
    },
    refunded: {
      icon: AlertCircle,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      label: "Refunded",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} rounded-xl p-6`}>
      <div className="flex items-center gap-4">
        <Icon className={`w-8 h-8 ${config.color} ${status === "processing" ? "animate-spin" : ""}`} />
        <div>
          <p className={`font-medium ${config.color}`}>{config.label}</p>
          <p className="text-slate-400 text-sm">
            {symbol}{amount} • {timestamp || new Date().toLocaleDateString()}
          </p>
          {gatewayRef && (
            <p className="text-slate-500 text-xs font-mono mt-1">Ref: {gatewayRef}</p>
          )}
        </div>
      </div>
    </div>
  );
}