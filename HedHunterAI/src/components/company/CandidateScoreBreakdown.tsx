import { ScoreProgress } from "@/components/ui/Progress";
import { Card } from "@/components/ui/Card";

interface QuestionScore {
  order: number;
  questionText: string;
  score: number;
  weight: number;
  feedback: string;
}

interface CandidateScoreBreakdownProps {
  resumeScore: number;
  interviewScore: number;
  totalScore: number;
  questionScores: QuestionScore[];
  complianceFlags?: string[];
}

export function CandidateScoreBreakdown({
  resumeScore, interviewScore, totalScore, questionScores, complianceFlags = [],
}: CandidateScoreBreakdownProps) {
  return (
    <div className="space-y-5">
      <Card>
        <p className="font-mono text-[10.5px] tracking-[.14em] uppercase mb-4" style={{ color: "#64748b" }}>Score summary</p>
        <div className="space-y-3">
          <ScoreRow label="Overall score" score={totalScore} highlight />
          <ScoreRow label="Resume / qualifications" score={resumeScore} />
          <ScoreRow label="Interview performance" score={interviewScore} />
        </div>
      </Card>

      {questionScores.length > 0 && (
        <Card>
          <p className="font-mono text-[10.5px] tracking-[.14em] uppercase mb-4" style={{ color: "#64748b" }}>Per-question breakdown</p>
          <div className="space-y-4">
            {questionScores.map((qs, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-xs" style={{ color: "#475569" }}>
                    <span className="font-mono mr-1.5" style={{ color: "#64748b" }}>Q{qs.order}</span>
                    {qs.questionText.length > 80 ? qs.questionText.slice(0, 80) + "…" : qs.questionText}
                  </p>
                  <span className="font-mono text-xs flex-none" style={{ color: "#0f172a" }}>{Math.round(qs.score)}%</span>
                </div>
                <ScoreProgress score={qs.score} />
                {qs.feedback && (
                  <p className="mt-1.5 text-xs italic" style={{ color: "#94a3b8" }}>{qs.feedback}</p>
                )}
                {qs.weight !== 1.0 && (
                  <p className="mt-0.5 font-mono text-[10px]" style={{ color: "#94a3b8" }}>Weight: {qs.weight}×</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {complianceFlags.length > 0 && (
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,94,94,.06)", border: "1px solid rgba(255,94,94,.2)" }}>
          <p className="font-mono text-[10px] tracking-[.14em] uppercase mb-2" style={{ color: "#ff5e5e" }}>Compliance flags</p>
          <ul className="space-y-1">
            {complianceFlags.map((f, i) => (
              <li key={i} className="text-xs" style={{ color: "#475569" }}>• {f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreRow({ label, score, highlight }: { label: string; score: number; highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-xs" style={{ color: highlight ? "#0f172a" : "#475569", fontWeight: highlight ? 600 : 400 }}>{label}</span>
        <span className="font-mono text-xs" style={{ color: highlight ? "#3ce8ff" : "#475569" }}>{Math.round(score)}%</span>
      </div>
      <ScoreProgress score={score} />
    </div>
  );
}
