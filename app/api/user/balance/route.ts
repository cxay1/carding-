import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock balance - replace with database call
  return NextResponse.json({
    balance: 0,
    currency: "USD",
  });
}

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await request.json();

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    newBalance: amount,
  });
}