import OpenAI from "openai";
import type { TranscriptionResult } from "@/types/interview";
import { createAuditLog } from "@/lib/audit-log";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeAudio(
  audioBlob: Blob,
  applicationId: string,
  answerId: string
): Promise<TranscriptionResult> {
  const file = new File([audioBlob], "answer.webm", { type: "audio/webm" });

  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "verbose_json",
    language: "en",
  });

  const result: TranscriptionResult = {
    transcript:  response.text,
    language:    (response as any).language ?? "en",
    confidence:  (response as any).avg_logprob ? Math.exp((response as any).avg_logprob) : 0.9,
    durationSec: (response as any).duration ?? 0,
  };

  await createAuditLog({
    actorType:  "AI",
    action:     "ANSWER_TRANSCRIBED",
    targetId:   answerId,
    targetType: "InterviewAnswer",
    status:     "OK",
    metadata:   { applicationId, durationSec: result.durationSec },
  });

  return result;
}

export async function transcribeFromUrl(audioUrl: string): Promise<string> {
  const response = await fetch(audioUrl);
  const blob = await response.blob();
  const result = await transcribeAudio(blob, "system", "system");
  return result.transcript;
}
