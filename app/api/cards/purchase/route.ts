import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs";

const purchaseSchema = z.object({
  cardId: z.string(),
  paymentMethodId: z.string(),
});

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = purchaseSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Mock - integrate with Stripe/Paystack
  const purchase = {
    id: `pch_${Date.now()}`,
    userId,
    cardId: result.data.cardId,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(purchase, { status: 201 });
}