import { NextResponse } from "next/server";

const mockCards = [
  { id: "1", denomination: 25, currency: "USD", region: "US" },
  { id: "2", denomination: 50, currency: "USD", region: "US" },
  { id: "3", denomination: 100, currency: "USD", region: "US" },
  { id: "4", denomination: 5000, currency: "NGN", region: "NG" },
  { id: "5", denomination: 10000, currency: "NGN", region: "NG" },
];

export async function GET() {
  return NextResponse.json(mockCards);
}