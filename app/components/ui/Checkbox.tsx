"use client";

import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer", disabled && "opacity-50")}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-primary-600 focus:ring-primary-500"
      />
      {label && <span className="text-slate-300">{label}</span>}
    </label>
  );
}