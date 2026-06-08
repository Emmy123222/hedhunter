"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface FlaggedQuestion {
  id: string;
  jobTitle: string;
  companyName: string;
  questionText: string;
  flagReason: string;
  isFlagged: boolean;
}

export function FlaggedQuestionTable({ questions: initial }: { questions: FlaggedQuestion[] }) {
  const [questions, setQuestions] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  async function resolve(id: string) {
    setLoading(id);
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resolve-flag", targetId: id }),
    });
    setQuestions(q => q.filter(r => r.id !== id));
    setLoading(null);
  }

  if (questions.length === 0) {
    return <p className="text-sm font-mono py-6 text-center" style={{ color: "#64748b" }}>No flagged questions</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            {["Company","Job","Question","Reason","Actions"].map(h => (
              <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <td className="py-3 px-3">
                <span className="text-xs" style={{ color: "#475569" }}>{q.companyName}</span>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs" style={{ color: "#475569" }}>{q.jobTitle}</span>
              </td>
              <td className="py-3 px-3 max-w-[260px]">
                <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
                  {q.questionText.length > 120 ? q.questionText.slice(0, 120) + "…" : q.questionText}
                </p>
              </td>
              <td className="py-3 px-3">
                <Badge color="danger" size="xs">{q.flagReason}</Badge>
              </td>
              <td className="py-3 px-3">
                <Button variant="ghost" size="sm" loading={loading === q.id} onClick={() => resolve(q.id)}>
                  Resolve
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
