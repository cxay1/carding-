import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await request.text();
  const webhook = new Webhook(webhookSecret);

  let event: any;
  try {
    event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "user.created": {
      const user = event.data;
      console.log("User created:", user.id);
      break;
    }
    case "user.updated": {
      const user = event.data;
      console.log("User updated:", user.id);
      break;
    }
    case "user.deleted": {
      const user = event.data;
      console.log("User deleted:", user.id);
      break;
    }
    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}