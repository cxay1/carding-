import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    userId,
    preferences: {
      twoFactorEnabled: false,
      emailNotifications: true,
      region: "US",
      currency: "USD",
    },
  });
}

export async function POST(request: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preferences = await request.json();

  return NextResponse.json({
    success: true,
    preferences,
  });
}