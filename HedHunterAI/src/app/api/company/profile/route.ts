import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const snap = await adminCol.companyProfiles(session.uid).get();
  return NextResponse.json({ profile: snap.exists ? snap.data() : null });
}

export async function PATCH(req: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, industry, website, contactPerson, contactTitle, phone, city, state, county, zipCode, annualRevenue, meritPledgeSigned } = await req.json();

  await adminCol.companyProfiles(session.uid).set({
    uid: session.uid, name, industry, website, contactPerson, contactTitle, phone,
    city, state, county, zipCode,
    annualRevenue, meritPledgeSigned: meritPledgeSigned ?? false,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  const snap = await adminCol.companyProfiles(session.uid).get();
  return NextResponse.json({ profile: snap.data() });
}
