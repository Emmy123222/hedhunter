import Groq from "groq-sdk";
import { SCORER_SYSTEM_PROMPT, buildScorerPrompt } from "./prompts";
import type { InterviewScoreRequest, InterviewScoreResponse } from "@/types/ai";
import { logAIScore } from "@/lib/audit-log";

// Groq (llama-3.3-70b) for interview scoring — fast and cost-effective
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function scoreInterviewAnswer(
  request: InterviewScoreRequest,
  applicationId: string,
  answerId: string
): Promise<InterviewScoreResponse> {
  const response = await groq.chat.completions.create({
    model:       "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      { role: "system", content: SCORER_SYSTEM_PROMPT },
      {
        role:    "user",
        content: buildScorerPrompt({
          question:   request.questionText,
          ideal:      request.idealAnswer ?? "No rubric provided — score on general merit.",
          transcript: request.transcript,
          weight:     request.weight,
        }),
      },
    ],
  });

  const raw   = response.choices[0]?.message?.content ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();

  let result: InterviewScoreResponse;
  try {
    result       = JSON.parse(clean);
    result.score = Math.max(0, Math.min(5, result.score));
  } catch {
    result = { score: 0, explanation: "Scoring failed", strengths: [], missingPoints: [], confidence: 0.3 };
  }

  await logAIScore({ applicationId, answerId, score: result.score, confidence: result.confidence });

  return result;
}

export async function scoreAllAnswers(
  answers: { id: string; transcript: string; question: { questionText: string; idealAnswer?: string | null; weight: number } }[],
  applicationId: string
): Promise<InterviewScoreResponse[]> {
  return Promise.all(
    answers.map((a) =>
      scoreInterviewAnswer(
        {
          questionText: a.question.questionText,
          idealAnswer:  a.question.idealAnswer ?? "",
          transcript:   a.transcript ?? "",
          weight:       a.question.weight,
        },
        applicationId,
        a.id
      )
    )
  );
}
