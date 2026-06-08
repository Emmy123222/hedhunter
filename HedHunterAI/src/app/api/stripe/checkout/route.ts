import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { createSeekerAnnualCheckout, createCompanyAnnualCheckout, createJobPostCheckout } from "@/services/payments/stripe-checkout.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, jobPostId, openPositions } = await req.json();
    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    let checkout;
    switch (type) {
      case "seeker-annual":
        checkout = await createSeekerAnnualCheckout(session.uid, session.email, `${origin}/job-seeker/payment?success=1`, `${origin}/job-seeker/payment?cancel=1`);
        break;
      case "company-annual":
        checkout = await createCompanyAnnualCheckout(session.uid, session.email, `${origin}/company/payment?success=1`, `${origin}/company/payment?cancel=1`);
        break;
      case "job-post":
        if (!jobPostId || !openPositions) return NextResponse.json({ error: "Missing jobPostId or openPositions" }, { status: 400 });
        checkout = await createJobPostCheckout(session.uid, session.email, openPositions, jobPostId, `${origin}/company/jobs/${jobPostId}/questions?paid=1`, `${origin}/company/jobs/create?cancel=1`);
        break;
      default:
        return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err: any) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
