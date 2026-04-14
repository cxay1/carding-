"use client";

import { useState } from "react";
import { ExternalLink, Copy, Share2, MoreHorizontal } from "lucide-react";

interface CardActionsProps {
  cardId: string;
  code: string;
}

export default function CardActions({ cardId, code }: CardActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Gift Card", text: `Gift card code: ${code}` });
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 rounded-lg text-slate-300 hover:text-white text-sm">
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
        <button onClick={handleShare} className="p-1.5 bg-slate-700 rounded-lg text-slate-300 hover:text-white">
          <Share2 className="w-4 h-4" />
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 bg-slate-700 rounded-lg text-slate-300 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      {menuOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-10">
          <button className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white">
            <ExternalLink className="w-4 h-4" />
            View Details
          </button>
        </div>
      )}
    </div>
  );
}