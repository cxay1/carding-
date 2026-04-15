import { NextResponse } from "next/server";
import { z } from "zod";

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(100),
  template: z.enum(["welcome", "payment_success", "card_delivered", "redemption", "dispute"]),
  data: z.record(z.any()).optional(),
});

const templates = {
  welcome: {
    subject: "Welcome to ChargeLine!",
    body: "Thank you for joining ChargeLine. Start buying gift cards today!",
  },
  payment_success: {
    subject: "Payment Successful",
    body: "Your payment has been processed. Your gift card is ready.",
  },
  card_delivered: {
    subject: "Gift Card Delivered",
    body: "Your gift card has been delivered. You can view it in your dashboard.",
  },
  redemption: {
    subject: "Code Redeemed",
    body: "Your gift card code has been redeemed successfully.",
  },
  dispute: {
    subject: "Dispute Received",
    body: "We've received your dispute and will review it within 24 hours.",
  },
};

export async function POST(request: Request) {
  const body = await request.json();
  const result = emailSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid email data", details: result.error.issues },
      { status: 400 }
    );
  }

  const { to, template, data } = result.data;
  const templateConfig = templates[template];

  // Mock email sending - integrate with SendGrid, Resend, etc.
  console.log(`Sending ${template} email to ${to}`);
  console.log(`Subject: ${templateConfig.subject}`);
  console.log(`Body: ${templateConfig.body}`);
  console.log(`Data:`, data);

  return NextResponse.json({
    success: true,
    messageId: `msg_${Date.now()}`,
    to,
    template,
    sentAt: new Date().toISOString(),
  });
}