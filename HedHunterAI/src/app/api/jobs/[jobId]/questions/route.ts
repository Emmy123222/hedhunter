import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";

export async function GET(_req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await adminCol.jobQuestions(params.jobId).orderBy("order", "asc").get();
  return NextResponse.json({ questions: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
}

export async function POST(req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const jobSnap = await adminCol.jobPosts(params.jobId).get();
  if (!jobSnap.exists || jobSnap.data()?.companyId !== session.uid)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { questions } = await req.json();

  // Delete existing questions
  const existing = await adminCol.jobQuestions(params.jobId).get();
  await Promise.all(existing.docs.map(d => d.ref.delete()));

  // Create new
  await Promise.all(
    (questions as Array<{ order: number; questionText: string; timeLimitSec: number; idealAnswer?: string; weight?: number }>)
      .map(q => adminCol.jobQuestions(params.jobId).add({
        order: q.order, questionText: q.questionText,
        timeLimitSec: q.timeLimitSec, idealAnswer: q.idealAnswer ?? "",
        weight: q.weight ?? 1.0, isFlagged: false,
        createdAt: FieldValue.serverTimestamp(),
      }))
  );

  return NextResponse.json({ count: questions.length });
}
