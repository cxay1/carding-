import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = [
    { id: "1", type: "payment", message: "Payment successful", read: false, createdAt: new Date().toISOString() },
    { id: "2", type: "card", message: "New gift card added", read: true, createdAt: new Date().toISOString() },
  ];

  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, action } = await request.json();

  if (action === "read") {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}