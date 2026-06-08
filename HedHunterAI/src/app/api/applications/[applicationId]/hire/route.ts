import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { createAuditLog } from "@/lib/audit-log";

export async function POST(req: Request, { params }: { params: { applicationId: string } }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const appSnap = await adminCol.applications(params.applicationId).get();
  if (!appSnap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const app     = appSnap.data()!;
  const jobSnap = await adminCol.jobPosts(app.jobPostId).get();
  if (jobSnap.data()?.companyId !== session.uid) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { startDate } = await req.json();

  await adminCol.applications(params.applicationId).update({
    status: "HIRED", identityUnsealed: true,
    unsealedAt: new Date(), unsealedBy: session.uid,
    updatedAt: FieldValue.serverTimestamp(),
  });

  await adminCol.offersCol().add({
    applicationId: params.applicationId,
    hireDate:   startDate ? new Date(startDate) : new Date(),
    isAccepted: true,
    acceptedAt: new Date(),
    paymentDone: false,
    createdAt:   FieldValue.serverTimestamp(),
  });

  await createAuditLog({
    actorId: session.uid, actorType: "USER", action: "CANDIDATE_HIRED",
    targetId: params.applicationId, targetType: "Application",
    metadata: { applicantCode: app.anonymousCode, startDate },
  });

  const seekerSnap = await adminCol.users(app.jobSeekerId).get();
  return NextResponse.json({ candidateEmail: seekerSnap.data()?.email ?? "Candidate" });
}
