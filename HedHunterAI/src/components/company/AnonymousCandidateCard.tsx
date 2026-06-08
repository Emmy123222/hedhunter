import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreProgress } from "@/components/ui/Progress";
import { ButtonLink } from "@/components/ui/Button";
import { UserCircle2 } from "lucide-react";

interface AnonymousCandidateCardProps {
  applicationId: string;
  applicantCode: string;
  rank?: number;
  totalScore: number;
  status: string;
  jobPostId: string;
  appliedAt: string;
}

const STATUS_COLOR: Record<string, "muted" | "good" | "warn" | "danger"> = {
  PENDING: "muted", REVIEWING: "warn", SHORTLISTED: "good",
  REJECTED: "danger", OFFERED: "good", HIRED: "good",
};

export function AnonymousCandidateCard({
  applicationId, applicantCode, rank, totalScore, status, jobPostId, appliedAt,
}: AnonymousCandidateCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-none"
            style={{ background: "rgba(60,232,255,.08)", border: "1px solid rgba(60,232,255,.15)" }}>
            <UserCircle2 size={20} style={{ color: "#3ce8ff" }}/>
          </div>
          <div>
            <p className="font-mono text-sm font-medium" style={{ color: "#0f172a" }}>{applicantCode}</p>
            {rank !== undefined && (
              <p className="text-xs font-mono mt-0.5" style={{ color: "#64748b" }}>Rank #{rank}</p>
            )}
          </div>
        </div>
        <Badge color={STATUS_COLOR[status] ?? "default"} size="xs">{status}</Badge>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>Score</span>
          <span className="font-mono text-xs" style={{ color: "#475569" }}>{Math.round(totalScore)}%</span>
        </div>
        <ScoreProgress score={totalScore} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>
          {new Date(appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <ButtonLink href={`/company/jobs/${jobPostId}/candidates/${applicationId}`} variant="ghost" size="sm">
          View profile →
        </ButtonLink>
      </div>
    </Card>
  );
}
