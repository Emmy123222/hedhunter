import { requireCompany } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InterviewQuestionBuilder } from "@/components/company/InterviewQuestionBuilder";
import { notFound } from "next/navigation";

export default async function JobQuestionsPage({
  params,
  searchParams,
}: {
  params: { jobId: string };
  searchParams: { paid?: string };
}) {
  const session = await requireCompany();
  const jobSnap = await adminCol.jobPosts(params.jobId).get();
  if (!jobSnap.exists || jobSnap.data()?.companyId !== session.uid) notFound();

  const qSnap     = await adminCol.jobQuestions(params.jobId).orderBy("order", "asc").get();
  const questions = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const justPaid  = searchParams.paid === "1";

  return (
    <DashboardShell role="COMPANY" title="Interview questions" subtitle={justPaid ? "Payment received — generating your 20 AI questions…" : `${questions.length}/20 questions`}>
      <div className="max-w-3xl">
        <InterviewQuestionBuilder
          jobPostId={params.jobId}
          initialQuestions={justPaid ? [] : (questions as any)}
          autoGenerate={justPaid}
        />
      </div>
    </DashboardShell>
  );
}
