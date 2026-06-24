import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { PRICING } from "@/lib/constants";

// Mobile-specific endpoint: creates a PaymentIntent and returns clientSecret
// for use with Stripe React Native Payment Sheet (not the web Checkout redirect flow)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type } = await req.json();

    let amountCents: number;
    let paymentType: string;

    switch (type) {
      case "SEEKER_ANNUAL":
        amountCents = PRICING.SEEKER_ANNUAL_CENTS;
        paymentType = "SEEKER_ANNUAL";
        break;
      case "COMPANY_ANNUAL":
        amountCents = PRICING.COMPANY_ANNUAL_CENTS;
        paymentType = "COMPANY_ANNUAL";
        break;
      default:
        return NextResponse.json({ error: "Invalid payment type" }, { status: 400 });
    }

    const customerId = await getOrCreateStripeCustomer(session.email, session.uid);
    await adminCol.stripeCustomers(session.uid).set(
      { uid: session.uid, stripeCustomerId: customerId },
      { merge: true }
    );

    const intent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: "usd",
      customer: customerId,
      metadata: { userId: session.uid, type: paymentType },
      automatic_payment_methods: { enabled: true },
    });

    // Create pending payment record (webhook will complete it)
    await adminCol.paymentsCol().add({
      userId:          session.uid,
      type:            paymentType,
      status:          "PENDING",
      amountCents,
      stripePaymentId: intent.id,
      metadata:        {},
      createdAt:       FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err: any) {
    console.error("[stripe/payment-intent]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
