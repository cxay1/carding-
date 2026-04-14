import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { type, description } = await request.json();

  return NextResponse.json({
    success: true,
    message: "Dispute submitted successfully",
  });
}