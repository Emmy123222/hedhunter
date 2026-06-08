import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";

export async function GET(_req: Request, { params }: { params: { applicationId: string } }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "JOB_SEEKER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const appSnap = await adminCol.applications(params.applicationId).get();
  if (!appSnap.exists || appSnap.data()?.jobSeekerId !== session.uid)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const jobPostId = appSnap.data()!.jobPostId;
  const qSnap     = await adminCol.jobQuestions(jobPostId).orderBy("order", "asc").get();

  const questions = qSnap.docs.map(d => ({
    id:           d.id,
    order:        d.data().order,
    questionText: d.data().questionText,
    timeLimitSec: d.data().timeLimitSec,
  }));

  return NextResponse.json({ questions });
}
