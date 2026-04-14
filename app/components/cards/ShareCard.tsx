"use client";

import { useState } from "react";
import { Share2, Copy, ExternalLink, MoreHorizontal } from "lucide-react";

interface ShareCardProps {
  cardId: string;
  code: string;
}

export default function ShareCard({ cardId, code }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    { id: "copy", label: "Copy Code", icon: Copy },
    { id: "share", label: "Share", icon: Share2 },
    { id: "external", label: "Open", icon: ExternalLink },
  ];

  return (
    <div className="flex gap-2">
      {shareLinks.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className="flex items-center gap-1 px-3 py-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600"
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}