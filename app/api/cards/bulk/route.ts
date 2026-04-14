import { NextResponse } from "next/server";
import { z } from "zod";

const bulkUploadSchema = z.array(z.object({
  code: z.string().min(8).max(50),
  denomination: z.number().positive(),
  currency: z.enum(["USD", "NGN"]),
  region: z.enum(["US", "NG"]),
  expiresAt: z.string(),
}));

export async function GET() {
  // Mock - return all cards for admin
  const cards = [];
  return NextResponse.json({ cards, total: 0 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = bulkUploadSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.issues },
      { status: 400 }
    );
  }

  const { data } = result;
  const processed = data.map(card => ({
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    ...card,
    status: "UNUSED",
    createdAt: new Date().toISOString(),
  }));

  return NextResponse.json({
    success: true,
    count: processed.length,
    cards: processed,
  }, { status: 201 });
}