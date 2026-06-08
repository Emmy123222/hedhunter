import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const STRIPE_PRICES = {
  SEEKER_ANNUAL:  process.env.STRIPE_SEEKER_ANNUAL_PRICE_ID  ?? "",
  SEEKER_OFFER:   process.env.STRIPE_SEEKER_OFFER_PRICE_ID   ?? "",
  COMPANY_ANNUAL: process.env.STRIPE_COMPANY_ANNUAL_PRICE_ID ?? "",
} as const;

export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    payment_method_types: ["card"],
    line_items: [{ price: params.priceId, quantity: 1 }],
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
}

export async function getOrCreateStripeCustomer(email: string, userId: string): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;
  const customer = await stripe.customers.create({ email, metadata: { userId } });
  return customer.id;
}
