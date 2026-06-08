import type { AIScoreResult } from "@/types/ai";

export function calculateTotalScore(scores: AIScoreResult[], maxQuestions: number): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + (s.humanOverrideScore ?? s.score), 0);
  const maxPossible = maxQuestions * 5;
  return Math.round((total / maxPossible) * 100);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#3ddc97";
  if (score >= 60) return "#3ce8ff";
  if (score >= 40) return "#f5a524";
  return "#ff5e5e";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Improvement";
}

export function averageConfidence(scores: AIScoreResult[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length;
}
