import { NextResponse } from "next/server";
import { z } from "zod";

const cardSchema = z.object({
  denomination: z.number().min(1),
  currency: z.enum(["USD", "NGN"]),
  region: z.enum(["US", "NG"]),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Mock - replace with database call
  const card = {
    id,
    denomination: 50,
    currency: "USD",
    region: "US",
    status: "UNUSED",
  };

  return NextResponse.json(card);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const result = cardSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    id,
    ...result.data,
  });
}