"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} animate-spin text-primary-400`} />
      {text && <span className={`${textSizes[size]} text-slate-400`}>{text}</span>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}