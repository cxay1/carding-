"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

interface CardDetailsProps {
  code: string;
  denomination: number;
  currency: string;
  region: string;
  expiresAt: string;
  status: "UNUSED" | "USED" | "EXPIRED";
}

export default function CardDetails({
  code,
  denomination,
  currency,
  region,
  expiresAt,
  status,
}: CardDetailsProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskedCode = revealed ? code : `${code.slice(0, 4)}****${code.slice(-4)}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    UNUSED: "bg-green-600",
    USED: "bg-slate-600",
    EXPIRED: "bg-red-600",
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">
            ${denomination} {region}
          </h3>
          <p className="text-slate-400">{currency} Gift Card</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-white text-sm ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Code</span>
          <div className="flex items-center gap-2">
            <code className="font-mono text-white">{maskedCode}</code>
            <button
              onClick={() => setRevealed(!revealed)}
              className="text-slate-400 hover:text-white"
            >
              {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {status === "UNUSED" && (
          <button
            onClick={copyCode}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy code"}
          </button>
        )}

        <div className="flex justify-between">
          <span className="text-slate-400">Expires</span>
          <span className="text-white">{expiresAt}</span>
        </div>
      </div>
    </div>
  );
}