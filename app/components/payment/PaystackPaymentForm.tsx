"use client";

import { useState, useEffect } from "react";

interface PaystackPaymentFormProps {
  amount: number;
  email: string;
  onSuccess: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        onSuccess: () => void;
        onCancel: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export default function PaystackPaymentForm({
  amount,
  email,
  onSuccess,
}: PaystackPaymentFormProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    setLoading(true);

    const ref = `CHG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

    if (window.PaystackPop) {
      const paystack = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: amount * 100,
        ref,
        onSuccess: () => {
          setLoading(false);
          onSuccess();
        },
        onCancel: () => {
          setLoading(false);
        },
      });
      paystack.openIframe();
    } else {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
    >
      {loading ? "Processing..." : `Pay ₦${amount}`}
    </button>
  );
}