import { NextResponse } from "next/server";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: Request) {
  const { code, userId } = await request.json();

  const now = Date.now();
  const key = `${userId}:redeem`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 3600000 });
    return NextResponse.json({ success: true, message: "Code redeemed" });
  }

  if (record.count >= 5) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  record.count++;
  return NextResponse.json({ success: true, message: "Code redeemed" });
}