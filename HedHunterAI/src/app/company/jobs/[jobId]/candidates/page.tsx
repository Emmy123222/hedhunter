import { requireCompany } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { CandidateRankingTable } from "@/components/company/CandidateRankingTable";
import { notFound } from "next/navigation";

export default async function CandidatesPage({ params }: { params: { jobId: string } }) {
  const session = await requireCompany();
  const jobSnap = await adminCol.jobPosts(params.jobId).get();
  if (!jobSnap.exists || jobSnap.data()?.companyId !== session.uid) notFound();
  const job     = { id: jobSnap.id, ...jobSnap.data() } as any;

  const appSnap = await adminCol.applicationsCol()
    .where("jobPostId","==",params.jobId)
    .where("status","in",["SUBMITTED","REVIEWING","SHORTLISTED","OFFER_SENT"]).get();

  const candidates = appSnap.docs.map((d) => {
    const a = d.data();
    return {
      applicationId:          d.id,
      applicantCode:          a.anonymousCode ?? "—",
      rank:                   0,
      totalScore:             a.totalScore ?? 0,
      resumeScore:            0,
      interviewScore:         a.totalScore ?? 0,
      status:                 a.status,
    };
  }).sort((a,b) => b.totalScore - a.totalScore).map((c,i) => ({ ...c, rank: i+1 }));

  return (
    <DashboardShell role="COMPANY" title={`Candidates — ${job.title}`} subtitle={`${candidates.length} applicants`}>
      <div className="max-w-4xl">
        <Card><CandidateRankingTable candidates={candidates} jobPostId={params.jobId} /></Card>
      </div>
    </DashboardShell>
  );
}
