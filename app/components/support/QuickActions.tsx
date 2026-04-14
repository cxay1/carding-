"use client";

import { useState } from "react";
import { MessageCircle, CreditCard, AlertTriangle, Globe, ArrowRight } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const quickActions: QuickAction[] = [
  { id: "card-not-working", label: "Card not working", icon: CreditCard, description: "Your code isn't being accepted" },
  { id: "wrong-region", label: "Wrong region", icon: Globe, description: "Card doesn't work in your country" },
  { id: "already-used", label: "Already used", icon: AlertTriangle, description: "Code says it's already been used" },
  { id: "payment-issue", label: "Payment issue", icon: MessageCircle, description: "Having trouble with payment" },
];

interface QuickActionsProps {
  onSelect: (action: string) => void;
}

export default function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onSelect(action.id)}
            className="flex items-start gap-3 p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-primary-500 transition text-left"
          >
            <Icon className="w-5 h-5 text-primary-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">{action.label}</p>
              <p className="text-slate-400 text-sm">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 ml-auto" />
          </button>
        );
      })}
    </div>
  );
}