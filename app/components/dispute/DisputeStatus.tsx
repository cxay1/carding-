"use client";

import { Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";

interface DisputeStatusProps {
  status: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
  resolution?: string;
}

export default function DisputeStatus({ status, resolution }: DisputeStatusProps) {
  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      label: "Pending Review",
    },
    UNDER_REVIEW: {
      icon: MessageCircle,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      label: "Under Review",
    },
    RESOLVED: {
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
      label: "Resolved",
    },
    REJECTED: {
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      label: "Rejected",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${config.color}`} />
        <span className={`font-medium ${config.color}`}>{config.label}</span>
      </div>
      {resolution && (
        <p className="text-slate-400 text-sm mt-2">{resolution}</p>
      )}
    </div>
  );
}