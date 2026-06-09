import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { generateApplicantCode } from "@/utils/generateApplicantCode";
import type { UserRole } from "@/types/user";

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uid, newRole } = await req.json();
  if (!uid || !newRole) {
    return NextResponse.json({ error: "uid and newRole required" }, { status: 400 });
  }

  const role = newRole as UserRole;

  // Delete old profile
  const userSnap = await adminCol.users(uid).get();
  const oldRole = userSnap.data()?.role as UserRole | undefined;

  if (oldRole === "JOB_SEEKER") await adminCol.jobSeekerProfiles(uid).delete().catch(() => {});
  if (oldRole === "COMPANY")    await adminCol.companyProfiles(uid).delete().catch(() => {});

  // Update user role
  await adminCol.users(uid).update({ role, updatedAt: FieldValue.serverTimestamp() });

  // Create new profile
  if (role === "JOB_SEEKER") {
    await adminCol.jobSeekerProfiles(uid).set({
      uid, applicantCode: generateApplicantCode(),
      registrationPaid: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else if (role === "COMPANY") {
    await adminCol.companyProfiles(uid).set({
      uid, name: "", meritPledgeSigned: false, status: "PENDING",
      averageRating: 0, totalRatings: 0, annualPaid: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  return NextResponse.json({ ok: true, uid, oldRole, newRole: role });
}
