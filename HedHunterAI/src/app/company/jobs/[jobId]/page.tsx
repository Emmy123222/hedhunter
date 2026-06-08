import { requireCompany } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { ArrowRight, Edit } from "lucide-react";

export default async function CompanyJobDetailPage({ params }: { params: { jobId: string } }) {
  const session = await requireCompany();
  const snap    = await adminCol.jobPosts(params.jobId).get();
  if (!snap.exists || snap.data()?.companyId !== session.uid) notFound();
  const job     = { id: snap.id, ...snap.data() } as any;
  const qSnap   = await adminCol.jobQuestions(params.jobId).orderBy("order","asc").get();
  const questions = qSnap.docs.length;

  return (
    <DashboardShell role="COMPANY" title={job.title} subtitle={`${job.location} · ${job.openPositions} positions`}>
      <div className="max-w-3xl space-y-5">
        <div className="flex items-center gap-3">
          <Badge color={job.isActive?"good":"muted"}>{job.isActive?"Active":"Closed"}</Badge>
          {!job.paymentConfirmed && <Badge color="warn">Payment required</Badge>}
        </div>
        <div className="flex gap-3">
          <ButtonLink href={`/company/jobs/${job.id}/candidates`} variant="accent" size="sm">View candidates <ArrowRight size={14}/></ButtonLink>
          <ButtonLink href={`/company/jobs/${job.id}/questions`} variant="ghost" size="sm"><Edit size={14}/>Questions ({questions})</ButtonLink>
        </div>
        <Card>
          <p className="font-mono text-[10.5px] tracking-widest uppercase mb-2" style={{ color:"#64748b" }}>Description</p>
          <p className="text-sm" style={{ color:"#475569" }}>{job.description}</p>
        </Card>
        <Card>
          <p className="font-mono text-[10.5px] tracking-widest uppercase mb-2" style={{ color:"#64748b" }}>Required qualifications</p>
          <p className="text-sm" style={{ color:"#475569" }}>{job.requiredQualifications}</p>
        </Card>
      </div>
    </DashboardShell>
  );
}
