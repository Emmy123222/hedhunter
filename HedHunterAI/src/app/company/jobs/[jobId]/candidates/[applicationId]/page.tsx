import { requireCompany } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { AnonymousCandidateCard } from "@/components/company/AnonymousCandidateCard";
import { CandidateScoreBreakdown } from "@/components/company/CandidateScoreBreakdown";
import { HireCandidateForm } from "@/components/company/HireCandidateForm";
import { Badge } from "@/components/ui/Badge";
import { notFound } from "next/navigation";

export default async function CandidateDetailPage({ params }: { params: { jobId: string; applicationId: string } }) {
  const session  = await requireCompany();
  const jobSnap  = await adminCol.jobPosts(params.jobId).get();
  if (!jobSnap.exists || jobSnap.data()?.companyId !== session.uid) notFound();

  const appSnap  = await adminCol.applications(params.applicationId).get();
  if (!appSnap.exists || appSnap.data()?.jobPostId !== params.jobId) notFound();
  const app      = { id: appSnap.id, ...appSnap.data() } as any;

  const [answersSnap, scoresSnap] = await Promise.all([
    adminCol.appAnswers(params.applicationId).get(),
    adminCol.appScores(params.applicationId).get(),
  ]);
  const answers  = answersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  const scores   = scoresSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  return (
    <DashboardShell role="COMPANY" title={`Candidate ${app.anonymousCode}`} subtitle={`Score: ${app.totalScore ?? "Not scored"}/${answers.length*5}`}>
      <div className="max-w-3xl space-y-5">
        <div className="flex items-center gap-3">
          <Badge status={app.status}>{app.status.replace(/_/g," ")}</Badge>
          {app.requiresHumanReview && <Badge color="warn">Human review required</Badge>}
        </div>
        <AnonymousCandidateCard
          applicationId={app.id}
          applicantCode={app.anonymousCode ?? "—"}
          totalScore={app.totalScore ?? 0}
          status={app.status}
          jobPostId={params.jobId}
          appliedAt={app.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString()}
        />
        {scores.length > 0 && (
          <CandidateScoreBreakdown
            totalScore={app.totalScore ?? 0}
            resumeScore={0}
            interviewScore={app.totalScore ?? 0}
            questionScores={scores.map((s: any, i: number) => ({
              order:        i + 1,
              questionText: answers.find((a: any) => a.id === s.answerId)?.anonymizedTranscript?.slice(0, 80) ?? `Question ${i + 1}`,
              score:        (s.score / 5) * 100,
              weight:       s.weight ?? 1,
              feedback:     s.explanation ?? "",
            }))}
          />
        )}
        {app.status === "SHORTLISTED" && (
          <HireCandidateForm
            applicationId={params.applicationId}
            applicantCode={app.anonymousCode ?? "—"}
            onHired={() => {}}
          />
        )}
      </div>
    </DashboardShell>
  );
}
