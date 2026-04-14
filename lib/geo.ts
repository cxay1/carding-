export function getPaymentProvider(region: "US" | "NG") {
  if (region === "NG") {
    return {
      gateway: "paystack",
      methods: ["card", "bank_transfer", "ussd", "qr", "mobile_money"] as const,
      currency: "NGN",
      symbol: "₦",
    };
  }
  return {
    gateway: "stripe",
    methods: ["card", "paypal", "apple_pay", "google_pay"] as const,
    currency: "USD",
    symbol: "$",
  };
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "₦";
  return `${symbol}${amount.toLocaleString()}`;
}

export function detectRegionFromHeader(header: string | null): "US" | "NG" {
  return header === "nigeria" ? "NG" : "US";
}