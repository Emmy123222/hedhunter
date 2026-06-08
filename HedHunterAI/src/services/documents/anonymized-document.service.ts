const HEADER = `ANONYMIZED DOCUMENT — IDENTITY PROTECTED
Processed by Hed Hunter AI for merit-based review.
All identifying information has been replaced with "Applicant".
─────────────────────────────────────────────

`;

export function buildAnonymizedResumeText(original: string, anonymized: string): string {
  void original;
  return HEADER + anonymized;
}

export function compareVectorCount(original: string, anonymized: string): number {
  const originalApplicants = (original.match(/Applicant/g) ?? []).length;
  const anonymizedApplicants = (anonymized.match(/Applicant/g) ?? []).length;
  return Math.max(0, anonymizedApplicants - originalApplicants);
}

export function flagLowConfidence(confidenceScore: number): boolean {
  return confidenceScore < 0.7;
}
