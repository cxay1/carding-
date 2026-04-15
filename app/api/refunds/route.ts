import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs";

const refundSchema = z.object({
  transactionId: z.string().min(1),
  reason: z.string().min(10).max(500),
});

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = refundSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.issues },
      { status: 400 }
    );
  }

  const { transactionId, reason } = result.data;

  const refund = {
    id: `ref_${Date.now()}`,
    transactionId,
    userId,
    reason,
    status: "PENDING",
    amount: 50, // Would calculate from transaction
    currency: "USD",
    createdAt: new Date().toISOString(),
    processedAt: null,
  };

  return NextResponse.json(refund, { status: 201 });
}

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const refunds = [
    { id: "ref_1", transactionId: "txn_001", amount: 50, status: "COMPLETED", createdAt: "2024-01-10" },
    { id: "ref_2", transactionId: "txn_002", amount: 25, status: "PENDING", createdAt: "2024-01-14" },
  ];

  const filtered = status 
    ? refunds.filter(r => r.status === status)
    : refunds;

  return NextResponse.json({ refunds: filtered });
}