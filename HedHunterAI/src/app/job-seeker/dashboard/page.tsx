import { requireJobSeeker } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { generateApplicantCode } from "@/utils/generateApplicantCode";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge, MeritScore } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";
import { Briefcase, FileText, Gift, TrendingUp, ArrowRight } from "lucide-react";

export default async function JobSeekerDashboard() {
  const session = await requireJobSeeker();

  // Auto-create profile if it doesn't exist yet (first login after Firestore was set up)
  let profileSnap = await adminCol.jobSeekerProfiles(session.uid).get();
  if (!profileSnap.exists) {
    await adminCol.users(session.uid).set({
      uid: session.uid, email: session.email, role: "JOB_SEEKER",
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    await adminCol.jobSeekerProfiles(session.uid).set({
      uid:              session.uid,
      applicantCode:    generateApplicantCode(),
      registrationPaid: false,
      createdAt:        FieldValue.serverTimestamp(),
      updatedAt:        FieldValue.serverTimestamp(),
    });
    profileSnap = await adminCol.jobSeekerProfiles(session.uid).get();
  }

  const profile = profileSnap.data()!;

  // Single-field where to avoid composite index requirement; sort in memory
  let apps: any[] = [];
  try {
    const appsSnap = await adminCol.applicationsCol()
      .where("jobSeekerId", "==", session.uid).limit(50).get();
    const raw = appsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

    // Enrich with job title
    const enriched = await Promise.all(raw.map(async (a: any) => {
      try {
        const jobSnap = await adminCol.jobPosts(a.jobPostId).get();
        return { ...a, jobTitle: jobSnap.data()?.title ?? "Position" };
      } catch { return { ...a, jobTitle: "Position" }; }
    }));

    apps = enriched.sort((a: any, b: any) =>
      (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0)
    ).slice(0, 5);
  } catch {
    // No applications yet
  }

  const submittedApps  = apps.filter((a:any) => a.status !== "DRAFT");
  const interviewCount = apps.filter((a:any) => ["SUBMITTED","REVIEWING","SHORTLISTED"].includes(a.status)).length;
  const offerCount     = apps.filter((a:any) => ["OFFER_SENT","HIRED"].includes(a.status)).length;
  const bestScore      = apps.reduce((max:number,a:any) => Math.max(max, a.totalScore ?? 0), 0);

  const stats = [
    { label:"Applications", value: submittedApps.length,   icon:<FileText size={18}/>, color:"#5b8def" },
    { label:"Interviews",   value: interviewCount,          icon:<Briefcase size={18}/>, color:"#3ce8ff" },
    { label:"Offers",       value: offerCount,              icon:<Gift size={18}/>, color:"#3ddc97" },
    { label:"Best Score",   value: bestScore + "pts",       icon:<TrendingUp size={18}/>, color:"#0f172a" },
  ];

  return (
    <DashboardShell role="JOB_SEEKER" title="Dashboard" subtitle={`Welcome back, ${profile.applicantCode}`}
      action={<ButtonLink href="/job-seeker/jobs" variant="accent">Browse Jobs →</ButtonLink>}>
      <div className="grid gap-6">
        {!profile.registrationPaid && (
          <div className="flex items-center justify-between p-4 rounded-xl" style={{background:"rgba(91,141,239,.07)",border:"1px solid rgba(91,141,239,.2)"}}>
            <div>
              <p className="font-medium text-[#0f172a]">Registration required</p>
              <p className="text-sm text-[#64748b] mt-0.5">Pay the $10 annual fee to start applying for jobs.</p>
            </div>
            <ButtonLink href="/job-seeker/payment" variant="accent" size="sm">Pay $10 →</ButtonLink>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s=>(
            <Card key={s.label} padded={false} hover>
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span style={{color:s.color}}>{s.icon}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase" style={{color:"#64748b"}}>{s.label}</span>
                </div>
                <p style={{fontFamily:"Instrument Serif,serif",fontSize:34,letterSpacing:"-.02em",lineHeight:1,color:"#0f172a"}}>{s.value}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card padded={false} glowTop>
          <CardHeader>
            <h3 style={{fontFamily:"Instrument Serif,serif",fontSize:22,fontWeight:400}}>Recent Applications</h3>
            <ButtonLink href="/job-seeker/applications" variant="ghost" size="sm">View all <ArrowRight size={14}/></ButtonLink>
          </CardHeader>
          <CardBody className="p-0">
            {apps.length===0 ? (
              <div className="p-8 text-center" style={{color:"#64748b"}}>
                <p className="mb-3">No applications yet.</p>
                <ButtonLink href="/job-seeker/jobs" variant="accent" size="sm">Browse open positions →</ButtonLink>
              </div>
            ) : apps.map((app:any,i:number)=>(
              <div key={app.id} className="flex items-center justify-between px-6 py-4"
                style={{borderBottom:i<apps.length-1?"1px solid rgba(0,0,0,.07)":"none"}}>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm text-[#0f172a]">{app.jobTitle ?? "Position"}</p>
                  <p className="text-xs" style={{color:"#0f172a"}}>{formatDate(app.createdAt?.toDate?.() ?? new Date())}</p>
                </div>
                <div className="flex items-center gap-3">
                  {app.totalScore!=null&&<MeritScore score={app.totalScore}/>}
                  <Badge status={app.status}>{app.status?.replace("_"," ")}</Badge>
                  <ButtonLink href={`/job-seeker/applications/${app.id}`} variant="ghost" size="sm"><ArrowRight size={14}/></ButtonLink>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
