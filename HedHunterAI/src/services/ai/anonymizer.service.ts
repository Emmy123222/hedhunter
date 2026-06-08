import Groq from "groq-sdk";
import { ANONYMIZER_SYSTEM_PROMPT, buildAnonymizerPrompt } from "./prompts";
import type { AnonymizationResult } from "@/types/ai";
import { createAuditLog } from "@/lib/audit-log";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Regex pre-pass to strip obvious PII before the AI sees the text.
// This catches patterns the AI might miss and reduces hallucinations.
function regexPreStrip(text: string): { cleaned: string; stripped: string[] } {
  const stripped: string[] = [];
  let out = text;

  const apply = (pattern: RegExp, replacement: string, label: string) => {
    const before = out;
    out = out.replace(pattern, replacement);
    if (out !== before) stripped.push(label);
  };

  // Emails
  apply(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "[email removed]", "email");
  // Phone numbers
  apply(/(\+?[\d\s\-().]{7,16}(?=\s|$|\n))/g, "[phone removed]", "phone");
  // LinkedIn / GitHub / personal URLs
  apply(/https?:\/\/(?:www\.)?(?:linkedin\.com|github\.com|twitter\.com|instagram\.com|facebook\.com)[^\s]*/gi, "[profile link removed]", "social-url");
  // Generic URLs (catch personal websites)
  apply(/https?:\/\/[^\s]+/g, "[url removed]", "url");
  // ZIP / postal codes (US 5-digit or CA format)
  apply(/\b\d{5}(?:-\d{4})?\b/g, "[zip removed]", "zip");
  // Titles (Mr./Mrs./Ms./Dr. before a name-like word)
  apply(/\b(Mr\.|Mrs\.|Ms\.|Miss|Dr\.|Prof\.)\s+[A-Z][a-z]+/g, "Applicant", "title+name");
  // Pronouns
  apply(/\b(he|she|him|her|his|hers|himself|herself)\b/gi, "", "pronoun");

  return { cleaned: out, stripped };
}

export async function anonymizeDocument(
  text: string,
  documentId: string,
  documentType: "resume" | "cover-letter" | "transcript"
): Promise<AnonymizationResult> {
  // Pre-strip obvious PII with regex
  const { cleaned, stripped: regexStripped } = regexPreStrip(text);

  const response = await groq.chat.completions.create({
    model:       "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      { role: "system", content: ANONYMIZER_SYSTEM_PROMPT },
      { role: "user",   content: buildAnonymizerPrompt(cleaned) },
    ],
  });

  const raw   = response.choices[0]?.message?.content ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();

  let result: AnonymizationResult;
  try {
    result = JSON.parse(clean);
  } catch {
    result = {
      anonymizedText:  cleaned,
      vectorsRemoved:  regexStripped,
      confidenceScore: 0.5,
      flaggedItems:    [{ original: "parse-error", reason: "AI response could not be parsed" }],
      requiresReview:  true,
    };
  }

  // Merge regex-stripped vectors into AI result
  result.vectorsRemoved = [...new Set([...regexStripped, ...(result.vectorsRemoved ?? [])])];
  result.requiresReview = result.confidenceScore < 0.85 || (result.flaggedItems?.length ?? 0) > 0;

  await createAuditLog({
    actorType:  "AI",
    action:     "RESUME_ANONYMIZED",
    targetId:   documentId,
    targetType: documentType,
    confidence: result.confidenceScore,
    status:     result.requiresReview ? "FLAG" : "OK",
    metadata:   { vectorsRemoved: result.vectorsRemoved },
  });

  return result;
}
