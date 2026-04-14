import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { subject, message } = await request.json();

  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    ticketId: `TKT-${Date.now()}`,
    message: "Support ticket created. A agent will respond within 24 hours.",
  });
}