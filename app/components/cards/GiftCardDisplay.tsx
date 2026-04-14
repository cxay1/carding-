"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface GiftCardDisplayProps {
  brand: string;
  denomination: number;
  currency: string;
  region: string;
  imageUrl?: string;
}

const brandLogos: Record<string, string> = {
  Amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  Netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  Steam: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
  Spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  Apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  Google: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
};

export default function GiftCardDisplay({
  brand,
  denomination,
  currency,
  region,
  imageUrl,
}: GiftCardDisplayProps) {
  const [copied, setCopied] = useState(false);

  const symbol = currency === "USD" ? "$" : "₦";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${brand}-${denomination}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <div className="aspect-[1.6/1] p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="text-white font-bold text-xl">{brand}</div>
          <div className="text-primary-400 text-lg font-bold">
            {symbol}{denomination}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-slate-400 text-sm">{region}</div>
          <div className="text-white text-2xl font-bold">{symbol}{denomination}</div>
        </div>
      </div>

      <div className="bg-slate-950/50 px-6 py-3 flex justify-between items-center">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button className="text-slate-400 hover:text-white">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}