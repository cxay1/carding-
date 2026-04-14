"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [region, setRegion] = useState<"US" | "NG">("US");

  const amount = cardId ? parseInt(cardId) : 50;

  useEffect(() => {
    const regionHeader = document.headers.get("x-user-region");
    setRegion(regionHeader === "nigeria" ? "NG" : "US");
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
          <div className="flex justify-between text-slate-400">
            <span>Gift Card</span>
            <span className="text-white">${amount}</span>
          </div>
          <div className="flex justify-between text-slate-400 mt-2">
            <span>Processing Fee</span>
            <span className="text-white">$0.00</span>
          </div>
          <div className="border-t border-slate-700 mt-4 pt-4 flex justify-between text-white font-bold">
            <span>Total</span>
            <span>${amount}</span>
          </div>
        </div>

        <PaymentMethodSelector
          region={region}
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
        />

        <div className="mt-6 text-slate-400 text-sm">
          <p>🔒 We never store your CVV. Encrypted with AES-256.</p>
        </div>
      </div>
    </main>
  );
}