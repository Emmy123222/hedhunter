"use client";
import { Badge } from "@/components/ui/Badge";
import { ScoreProgress } from "@/components/ui/Progress";
import { ButtonLink } from "@/components/ui/Button";
import { Trophy } from "lucide-react";

interface Candidate {
  applicationId: string;
  applicantCode: string;
  rank: number;
  totalScore: number;
  resumeScore: number;
  interviewScore: number;
  status: string;
}

interface CandidateRankingTableProps {
  candidates: Candidate[];
  jobPostId: string;
}

export function CandidateRankingTable({ candidates, jobPostId }: CandidateRankingTableProps) {
  if (!candidates.length) {
    return (
      <div className="py-10 text-center" style={{ color: "#64748b" }}>
        <p className="text-sm font-mono">No candidates yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            {["Rank","Applicant","Total","Resume","Interview","Status",""].map(h => (
              <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c.applicationId} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1.5">
                  {c.rank === 1 && <Trophy size={12} style={{ color: "#0f172a" }}/>}
                  <span className="font-mono text-xs" style={{ color: c.rank <= 3 ? "#0f172a" : "#64748b" }}>#{c.rank}</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="font-mono text-xs" style={{ color: "#475569" }}>{c.applicantCode}</span>
              </td>
              <td className="py-3 px-3 min-w-[120px]">
                <ScoreProgress score={c.totalScore} />
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#475569" }}>{Math.round(c.resumeScore)}%</span>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#475569" }}>{Math.round(c.interviewScore)}%</span>
              </td>
              <td className="py-3 px-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="py-3 px-3">
                <ButtonLink
                  href={`/company/jobs/${jobPostId}/candidates/${c.applicationId}`}
                  variant="ghost" size="sm"
                >
                  View →
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "muted" | "good" | "warn" | "danger"> = {
    PENDING: "muted", REVIEWING: "warn", SHORTLISTED: "good",
    REJECTED: "danger", OFFERED: "good", HIRED: "good",
  };
  return <Badge color={map[status] ?? "muted"} size="xs">{status}</Badge>;
}
