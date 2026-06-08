import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { handleWebhookEvent } from "@/services/payments/stripe-webhook.service";

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET ?? "");
    await handleWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[stripe/webhook]", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
