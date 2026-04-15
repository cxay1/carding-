import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Mock order data
  const order = {
    id,
    status: "PENDING",
    items: [
      { cardId: "card_1", brand: "Amazon", denomination: 50, quantity: 2, price: 50 },
      { cardId: "card_2", brand: "Steam", quantity: 1, price: 25 },
    ],
    total: 125,
    currency: "USD",
    paymentMethod: "Visa •••• 4242",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(order);
}