import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MapPin, Users, DollarSign } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    location: string;
    isRemote: boolean;
    isHybrid: boolean;
    salaryMin?: number | null;
    salaryMax?: number | null;
    openPositions: number;
    createdAt: Date;
    company: { name: string; averageRating: number; meritPledgeSigned: boolean };
    _count?: { questions: number };
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card hover padded={false}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-medium" style={{ color: "#0f172a" }}>{job.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm" style={{ color: "#64748b" }}>{job.company.name}</span>
              {job.company.averageRating > 0 && (
                <span className="text-xs font-mono" style={{ color: "#0f172a" }}>★ {job.company.averageRating.toFixed(1)}</span>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {job.isRemote && <Badge color="good" size="xs">Remote</Badge>}
            {job.isHybrid && <Badge color="cyan" size="xs">Hybrid</Badge>}
            {!job.isRemote && !job.isHybrid && <Badge color="muted" size="xs">On-site</Badge>}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
            <MapPin size={12}/>{job.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
            <Users size={12}/>{job.openPositions} open position{job.openPositions > 1 ? "s" : ""}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
              <DollarSign size={12}/>
              {job.salaryMin && job.salaryMax
                ? `$${(job.salaryMin/1000).toFixed(0)}k–$${(job.salaryMax/1000).toFixed(0)}k`
                : job.salaryMin ? `From $${(job.salaryMin/1000).toFixed(0)}k` : `Up to $${(job.salaryMax!/1000).toFixed(0)}k`}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#94a3b8" }}>
            Posted {formatDate(job.createdAt)}
          </span>
          <ButtonLink href={`/job-seeker/jobs/${job.id}`} variant="accent" size="sm">View & Apply →</ButtonLink>
        </div>
      </div>
    </Card>
  );
}
