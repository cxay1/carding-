"use client";

import { Globe } from "lucide-react";

interface RegionBadgeProps {
  region: "US" | "NG";
  size?: "sm" | "md";
}

export default function RegionBadge({ region, size = "md" }: RegionBadgeProps) {
  const flags = {
    US: { flag: "🇺🇸", label: "United States" },
    NG: { flag: "🇳🇬", label: "Nigeria" },
  };

  const config = flags[region];
  const sizes = { sm: "text-sm px-2 py-1", md: "text-base px-3 py-1.5" };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-slate-700 text-white ${sizes[size]}`}>
      <span>{config.flag}</span>
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
}