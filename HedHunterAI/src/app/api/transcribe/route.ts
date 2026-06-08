import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { createAuditLog } from "@/lib/audit-log";
import { anonymizeDocument as anonymizeText } from "@/services/ai/anonymizer.service";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "JOB_SEEKER") return NextResponse.json({ error: "Job seeker required" }, { status: 403 });

  const formData      = await req.formData();
  const audioFile     = formData.get("audio") as File | null;
  const applicationId = formData.get("applicationId") as string | null;
  const questionId    = formData.get("questionId") as string | null;

  if (!audioFile || !applicationId || !questionId)
    return NextResponse.json({ error: "audio, applicationId, questionId required" }, { status: 400 });

  const appSnap = await adminCol.applications(applicationId).get();
  if (!appSnap.exists || appSnap.data()?.jobSeekerId !== session.uid)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const transcription = await groq.audio.transcriptions.create({
    file:  audioFile,
    model: "whisper-large-v3",
  });

  const { anonymizedText } = await anonymizeText(transcription.text, questionId, "transcript");

  // Upsert answer
  const answersSnap = await adminCol.appAnswers(applicationId)
    .where("questionId", "==", questionId).limit(1).get();

  let answerId: string;
  if (!answersSnap.empty) {
    await answersSnap.docs[0].ref.update({ transcript: transcription.text, anonymizedTranscript: anonymizedText });
    answerId = answersSnap.docs[0].id;
  } else {
    const ref = await adminCol.appAnswers(applicationId).add({
      applicationId, questionId,
      transcript: transcription.text, anonymizedTranscript: anonymizedText,
      audioUrl: null, isWritten: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    answerId = ref.id;
  }

  await createAuditLog({ actorId: session.uid, actorType: "USER", action: "ANSWER_TRANSCRIBED", targetId: answerId, targetType: "InterviewAnswer" });
  return NextResponse.json({ answerId, transcript: transcription.text, anonymizedTranscript: anonymizedText });
}
