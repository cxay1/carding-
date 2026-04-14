"use client";

import { Gift, CreditCard } from "lucide-react";

interface OrderSummaryProps {
  denomination: number;
  currency: string;
  region: string;
}

export default function OrderSummary({
  denomination,
  currency,
  region,
}: OrderSummaryProps) {
  const processingFee = 0;
  const total = denomination + processingFee;

  const cardBrands: Record<string, string> = {
    US: "Amazon",
    NG: "Amazon Nigeria",
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
      
      <div className="flex items-center gap-4 mb-4 p-4 bg-slate-700 rounded-lg">
        <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
          <Gift className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <p className="text-white font-medium">{cardBrands[region] || "Gift Card"}</p>
          <p className="text-slate-400 text-sm">${denomination} {region}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-700 pt-4">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span className="text-white">
            {currency === "USD" ? "$" : "₦"}
            {denomination}
          </span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Processing Fee</span>
          <span className="text-white">
            {currency === "USD" ? "$" : "₦"}
            {processingFee.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
          <span className="text-white">Total</span>
          <span className="text-primary-400">
            {currency === "USD" ? "$" : "₦"}
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}