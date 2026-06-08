import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are an expert technical recruiter generating merit-based interview questions.
Generate exactly 20 interview questions for the given job role.
Each question must assess only skills, experience, and knowledge — never personal characteristics.
Return ONLY valid JSON: { "questions": [ { "questionText": "...", "timeLimitSec": 120, "idealAnswer": "...", "weight": 1.0 }, ... ] }
Rules:
- timeLimitSec: 60–300
- weight: 0.5–2.0 (default 1.0)
- Mix behavioral (40%), technical (40%), situational (20%)
- idealAnswer: 1–2 sentence rubric for scoring`;

export async function POST(_req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const jobSnap = await adminCol.jobPosts(params.jobId).get();
  if (!jobSnap.exists || jobSnap.data()?.companyId !== session.uid)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const job = jobSnap.data()!;

  const prompt = `Job title: ${job.title}
Description: ${job.description}
Required qualifications: ${job.requiredQualifications}
${job.preferredQualifications ? `Preferred qualifications: ${job.preferredQualifications}` : ""}

Generate 20 interview questions for this role.`;

  const completion = await groq.chat.completions.create({
    model:       "llama-3.3-70b-versatile",
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user",   content: prompt },
    ],
  });

  const raw   = completion.choices[0]?.message?.content ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();

  let parsed: { questions: Array<{ questionText: string; timeLimitSec: number; idealAnswer?: string; weight?: number }> };
  try {
    parsed = JSON.parse(clean);
  } catch {
    return NextResponse.json({ error: "AI returned invalid JSON — please try again" }, { status: 500 });
  }

  const questions = (parsed.questions ?? []).slice(0, 20);

  // Delete existing questions then write new ones
  const existing = await adminCol.jobQuestions(params.jobId).get();
  await Promise.all(existing.docs.map(d => d.ref.delete()));

  await Promise.all(
    questions.map((q, i) => adminCol.jobQuestions(params.jobId).add({
      order:       i + 1,
      questionText: q.questionText,
      timeLimitSec: q.timeLimitSec ?? 120,
      idealAnswer:  q.idealAnswer ?? "",
      weight:       q.weight ?? 1.0,
      isFlagged:    false,
      createdAt:    FieldValue.serverTimestamp(),
    }))
  );

  // Mark job as payment confirmed
  await adminCol.jobPosts(params.jobId).update({ paymentConfirmed: true, updatedAt: FieldValue.serverTimestamp() });

  return NextResponse.json({ count: questions.length });
}
