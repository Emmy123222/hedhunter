import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { sendCompanyApprovedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await req.json();
  if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });

  await adminCol.companyProfiles(companyId).update({
    status: "APPROVED",
    updatedAt: FieldValue.serverTimestamp(),
  });

  const userSnap = await adminCol.users(companyId).get();
  const email    = userSnap.data()?.email;
  const name     = (await adminCol.companyProfiles(companyId).get()).data()?.name ?? "Company";
  if (email) await sendCompanyApprovedEmail(email, name).catch(() => {});

  return NextResponse.json({ ok: true });
}
