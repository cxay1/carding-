"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutFormContent({ amount, onSuccess, onError }: { amount: number; onSuccess: () => void; onError: (e: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { data: { clientSecret } } = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, region: "US" }),
      }).then(r => r.json());

      if (!clientSecret) {
        throw new Error("Failed to create payment");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        onError(stripeError.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
      onError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
        <CardElement options={{
          style: {
            base: { fontSize: "16px", color: "#fff", "::placeholder": { color: "#94a3b8" } },
            invalid: { color: "#ef4444" },
          },
        }} />
      </div>
      
      {error && <div className="text-red-400 text-sm">{error}</div>}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        <Lock className="w-4 h-4" />
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
}

export default function CheckoutForm({ amount, onSuccess, onError }: { amount: number; onSuccess: () => void; onError: (e: string) => void }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}