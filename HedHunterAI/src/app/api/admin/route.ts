import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { createAuditLog } from "@/lib/audit-log";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [usersSnap, jobsSnap, paymentsSnap, pendingSnap, appealsSnap, flagsSnap] = await Promise.all([
    adminCol.usersCol().get(),
    adminCol.jobPostsCol().get(),
    adminCol.paymentsCol().where("status", "==", "COMPLETED").get(),
    adminCol.companyProfilesCol().where("status", "==", "PENDING").get(),
    adminCol.appealsCol().where("status", "==", "OPEN").get(),
    adminCol.complianceFlagsCol().where("isResolved", "==", false).get(),
  ]);

  const users           = usersSnap.docs.map(d => d.data());
  const totalRevenueCents = paymentsSnap.docs.reduce((s, d) => s + (d.data().amountCents ?? 0), 0);

  return NextResponse.json({
    totalUsers:      users.length,
    totalSeekers:    users.filter(u => u.role === "JOB_SEEKER").length,
    totalCompanies:  users.filter(u => u.role === "COMPANY").length,
    totalJobs:       jobsSnap.size,
    totalRevenueCents,
    pendingCompanies: pendingSnap.size,
    openAppeals:      appealsSnap.size,
    flaggedQuestions: flagsSnap.size,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { action, targetId, notes, resolution, approved } = await req.json();

  if (action === "approve-company") {
    await adminCol.companyProfiles(targetId).update({ status: "APPROVED", updatedAt: FieldValue.serverTimestamp() });
    await createAuditLog({ actorId: session.uid, actorType: "USER", action: "COMPANY_APPROVED", targetId, targetType: "CompanyProfile" });
    return NextResponse.json({ ok: true });
  }

  if (action === "suspend-company") {
    await adminCol.companyProfiles(targetId).update({ status: "SUSPENDED", updatedAt: FieldValue.serverTimestamp() });
    await createAuditLog({ actorId: session.uid, actorType: "USER", action: "COMPANY_SUSPENDED", targetId, targetType: "CompanyProfile" });
    return NextResponse.json({ ok: true });
  }

  if (action === "resolve-appeal") {
    await adminCol.appeals(targetId).update({
      status: resolution === "uphold" ? "RESOLVED" : "DISMISSED",
      reviewerNotes: notes, reviewedBy: session.uid, resolvedAt: new Date(),
    });
    await createAuditLog({ actorId: session.uid, actorType: "USER", action: "APPEAL_RESOLVED", targetId, targetType: "Appeal" });
    return NextResponse.json({ ok: true });
  }

  if (action === "resolve-flag") {
    await adminCol.complianceFlags(targetId).update({ isResolved: true, reviewedBy: session.uid, reviewedAt: new Date() });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
