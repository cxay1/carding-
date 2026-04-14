"use client";

import { useState } from "react";
import { Clock, MessageCircle, ChevronDown, ChevronRight } from "lucide-react";

interface Dispute {
  id: string;
  type: string;
  status: string;
  createdAt: string;
}

interface DisputeListProps {
  disputes: Dispute[];
}

export default function DisputeList({ disputes }: DisputeListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const statusConfig = {
    PENDING: { color: "text-yellow-400", label: "Pending" },
    UNDER_REVIEW: { color: "text-blue-400", label: "Under Review" },
    RESOLVED: { color: "text-green-400", label: "Resolved" },
    REJECTED: { color: "text-red-400", label: "Rejected" },
  };

  return (
    <div className="space-y-2">
      {disputes.map((dispute) => {
        const config = statusConfig[dispute.status as keyof typeof statusConfig];
        const isExpanded = expanded === dispute.id;

        return (
          <div key={dispute.id} className="bg-slate-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : dispute.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div>
                <span className="text-white font-medium">{dispute.type}</span>
                <div className="text-slate-400 text-sm mt-1">
                  {new Date(dispute.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={config.color}>{config.label}</span>
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </button>
            {isExpanded && (
              <div className="p-4 pt-0 border-t border-slate-700">
                <p className="text-slate-400">Dispute details here...</p>
              </div>
            )}
          </div>
        );
      })}

      {disputes.length === 0 && (
        <div className="text-center py-8 text-slate-400">No disputes found</div>
      )}
    </div>
  );
}