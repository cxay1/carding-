"use client";

import { useState } from "react";
import { Tag, Check } from "lucide-react";

interface CouponApplyProps {
  onApply: (code: string) => { valid: boolean; discount?: number; message?: string };
}

export default function CouponApply({ onApply }: CouponApplyProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [discount, setDiscount] = useState(0);

  const handleApply = () => {
    const result = onApply(code);
    if (result.valid) {
      setStatus("success");
      setDiscount(result.discount || 0);
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white uppercase"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={code.length < 4}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50"
        >
          Apply
        </button>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" />
          Coupon applied! -${discount} discount
        </div>
      )}

      {status === "error" && (
        <div className="text-red-400 text-sm">Invalid coupon code</div>
      )}
    </div>
  );
}