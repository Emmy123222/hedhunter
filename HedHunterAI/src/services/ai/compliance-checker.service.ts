import Groq from "groq-sdk";
import { COMPLIANCE_SYSTEM_PROMPT, buildCompliancePrompt } from "./prompts";
import type { ComplianceCheckResult } from "@/types/ai";
import { createAuditLog } from "@/lib/audit-log";

// Groq (llama-3.3-70b) for compliance checking — fast classification
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function checkQuestionCompliance(
  questionText: string,
  jobPostId: string
): Promise<ComplianceCheckResult> {
  const response = await groq.chat.completions.create({
    model:       "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      { role: "system", content: COMPLIANCE_SYSTEM_PROMPT },
      { role: "user",   content: buildCompliancePrompt(questionText) },
    ],
  });

  const raw   = response.choices[0]?.message?.content ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();

  let result: ComplianceCheckResult;
  try {
    result = JSON.parse(clean);
  } catch {
    result = { isSafe: false, flaggedTopics: ["parse-error"], reason: "Could not evaluate question." };
  }

  if (!result.isSafe) {
    await createAuditLog({
      actorType:  "GUARD",
      action:     "QUESTION_FLAGGED",
      targetId:   jobPostId,
      targetType: "JobPost",
      status:     "FLAG",
      metadata:   { questionText, flaggedTopics: result.flaggedTopics, reason: result.reason },
    });
  }

  return result;
}
