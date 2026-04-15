import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs";

const transferSchema = z.object({
  cardId: z.string().min(1),
  recipientEmail: z.string().email(),
  message: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = transferSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.issues },
      { status: 400 }
    );
  }

  const { cardId, recipientEmail, message } = result.data;

  const transfer = {
    id: `xfer_${Date.now()}`,
    cardId,
    fromUserId: userId,
    recipientEmail,
    message: message || null,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  return NextResponse.json(transfer, { status: 201 });
}

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const transfers = [
    { id: "xfer_1", cardId: "card_1", recipientEmail: "friend@example.com", status: "COMPLETED", createdAt: "2024-01-10" },
    { id: "xfer_2", cardId: "card_2", recipientEmail: "another@example.com", status: "PENDING", createdAt: "2024-01-14" },
  ];

  const filtered = type 
    ? transfers.filter(t => 
        type === "sent" ? t.fromUserId === userId : t.recipientEmail.includes("@")
      )
    : transfers;

  return NextResponse.json({ transfers: filtered });
}