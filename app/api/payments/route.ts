import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
});

export async function POST(request: Request) {
  const { amount, region } = await request.json();

  try {
    if (region === "US") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    }

    return NextResponse.json({ error: "Region not supported" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}