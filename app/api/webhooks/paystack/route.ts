import { NextResponse } from "next/server";
import crypto from "crypto";

const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";

  const hash = crypto
    .createHmac("sha512", webhookSecret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    console.error("Invalid Paystack webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  switch (event.event) {
    case "charge.success": {
      const data = event.data;
      console.log("Payment succeeded:", data.reference);
      break;
    }
    case "charge.failed": {
      const data = event.data;
      console.log("Payment failed:", data.reference);
      break;
    }
    default:
      console.log(`Unhandled event: ${event.event}`);
  }

  return NextResponse.json({ received: true });
}