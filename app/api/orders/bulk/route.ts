import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs";

const bulkPurchaseSchema = z.object({
  items: z.array(z.object({
    cardId: z.string(),
    quantity: z.number().min(1).max(10),
  })).min(1).max(20),
  paymentMethodId: z.string(),
});

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = bulkPurchaseSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.issues },
      { status: 400 }
    );
  }

  const { items } = result.data;

  // Calculate total
  const total = items.reduce((sum, item) => {
    const price = 50; // Mock price
    return sum + (price * item.quantity);
  }, 0);

  // Create bulk order
  const order = {
    id: `bulk_${Date.now()}`,
    userId,
    items: items.map(item => ({
      ...item,
      price: 50,
    })),
    total,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(order, { status: 201 });
}