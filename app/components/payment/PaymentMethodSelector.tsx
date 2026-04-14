"use client";

interface PaymentMethodSelectorProps {
  region: "US" | "NG";
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const usMethods = [
  { id: "card", label: "Credit/Debit Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
];

const ngMethods = [
  { id: "card", label: "Card", icon: "💳" },
  { id: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { id: "ussd", label: "USSD (*737#)", icon: "📱" },
];

export default function PaymentMethodSelector({
  region,
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  const methods = region === "NG" ? ngMethods : usMethods;

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id)}
            className={`w-full p-4 rounded-lg flex items-center gap-4 transition ${
              selectedMethod === method.id
                ? "bg-primary-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <span className="text-2xl">{method.icon}</span>
            <span>{method.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}