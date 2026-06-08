import { requireJobSeeker } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ApplyButton } from "./ApplyButton";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import { MapPin, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Job Detail" };

export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const session  = await requireJobSeeker();
  const jobSnap  = await adminCol.jobPosts(params.jobId).get();
  if (!jobSnap.exists || !jobSnap.data()?.isActive) notFound();
  const job      = { id: jobSnap.id, ...jobSnap.data() } as any;
  const compSnap = await adminCol.companyProfiles(job.companyId).get();
  const comp     = compSnap.data() as any;
  const qSnap    = await adminCol.jobQuestions(params.jobId).orderBy("order","asc").get();
  const questions = qSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  const [appSnap, profileSnap] = await Promise.all([
    adminCol.applicationsCol().where("jobSeekerId","==",session.uid).where("jobPostId","==",params.jobId).limit(1).get(),
    adminCol.jobSeekerProfiles(session.uid).get(),
  ]);
  const alreadyApplied   = !appSnap.empty;
  const registrationPaid = profileSnap.data()?.registrationPaid ?? false;

  return (
    <DashboardShell role="JOB_SEEKER" title={job.title} subtitle={comp?.name ?? ""}>
      <div className="max-w-3xl space-y-5">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 style={{ fontFamily:"Instrument Serif,serif", fontSize:24, fontWeight:400, color:"#0f172a" }}>{job.title}</h2>
                {comp?.meritPledgeSigned && (
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded"
                    style={{ background:"rgba(61,220,151,.09)", color:"#3ddc97", border:"1px solid rgba(61,220,151,.22)" }}>
                    <Shield size={10}/>Merit Pledge
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color:"#64748b" }}>{comp?.name} · <span className="flex-inline items-center gap-1"><MapPin size={11} style={{display:"inline"}}/>{job.location}{job.isRemote?" · Remote":""}</span></p>
            </div>
            <div className="text-right">
              {job.salaryMin && job.salaryMax && (
                <p className="font-mono text-sm" style={{ color:"#0f172a" }}>{formatCurrency(job.salaryMin*100)} – {formatCurrency(job.salaryMax*100)}</p>
              )}
              <p className="text-xs mt-0.5" style={{ color:"#64748b" }}>{job.openPositions} open position{job.openPositions>1?"s":""}</p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none mb-5 text-sm" style={{ color:"#475569" }}>
            <p>{job.description}</p>
          </div>
          <div className="mb-5">
            <p className="font-mono text-[10.5px] tracking-widest uppercase mb-2" style={{ color:"#64748b" }}>Required qualifications</p>
            <p className="text-sm" style={{ color:"#475569" }}>{job.requiredQualifications}</p>
          </div>
          {job.preferredQualifications && (
            <div className="mb-5">
              <p className="font-mono text-[10.5px] tracking-widest uppercase mb-2" style={{ color:"#64748b" }}>Preferred qualifications</p>
              <p className="text-sm" style={{ color:"#475569" }}>{job.preferredQualifications}</p>
            </div>
          )}
          <div className="mb-5">
            <p className="font-mono text-[10.5px] tracking-widest uppercase mb-2" style={{ color:"#64748b" }}>Interview format</p>
            <p className="text-sm mb-2" style={{ color:"#475569" }}>{questions.length} question{questions.length!==1?"s":""} · verbal answers recorded and AI-scored</p>
            <div className="space-y-1.5">
              {questions.map((q:any,i:number) => (
                <div key={q.id} className="flex items-center gap-2 text-xs p-2.5 rounded-lg" style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(0,0,0,.06)" }}>
                  <span className="font-mono w-5 text-center" style={{ color:"#94a3b8" }}>{i+1}</span>
                  <span style={{ color:"#475569" }}>{q.questionText}</span>
                  <span className="ml-auto font-mono" style={{ color:"#94a3b8" }}>{q.timeLimitSec}s</span>
                </div>
              ))}
            </div>
          </div>
          {alreadyApplied ? (
            <Badge color="good">Already applied</Badge>
          ) : (
            <ApplyButton jobPostId={params.jobId} registrationPaid={registrationPaid} />
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
