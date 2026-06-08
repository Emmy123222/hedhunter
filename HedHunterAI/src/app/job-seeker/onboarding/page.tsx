import { requireJobSeeker } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ButtonLink } from "@/components/ui/Button";
import { Check, Circle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Onboarding" };

export default async function OnboardingPage() {
  const session    = await requireJobSeeker();
  const [profileSnap, resumesSnap] = await Promise.all([
    adminCol.jobSeekerProfiles(session.uid).get(),
    adminCol.resumeDocumentsCol().where("jobSeekerId", "==", session.uid).limit(1).get(),
  ]);
  const profile = profileSnap.data();

  const steps = [
    { label: "Pay $10 annual registration fee", done: profile?.registrationPaid ?? false, href: "/job-seeker/payment" },
    { label: "Upload and anonymize your resume", done: !resumesSnap.empty,               href: "/job-seeker/resume-upload" },
    { label: "Browse open job positions",        done: false,                             href: "/job-seeker/jobs" },
  ];

  const nextStep = steps.find(s => !s.done);

  return (
    <DashboardShell role="JOB_SEEKER" title="Getting started" subtitle="Complete these steps to start applying">
      <div className="max-w-lg space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl"
            style={{ border: "1px solid rgba(0,0,0,.07)", background: step.done ? "rgba(61,220,151,.04)" : "rgba(0,0,0,.03)" }}>
            <div className="w-8 h-8 rounded-full grid place-items-center flex-none"
              style={{ background: step.done ? "rgba(61,220,151,.15)" : "rgba(0,0,0,.05)", border: `1px solid ${step.done ? "rgba(61,220,151,.3)" : "rgba(0,0,0,.09)"}` }}>
              {step.done ? <Check size={14} style={{ color: "#3ddc97" }}/> : <Circle size={14} style={{ color: "#94a3b8" }}/>}
            </div>
            <p className="flex-1 text-sm" style={{ color: step.done ? "#3ddc97" : "#0f172a" }}>{step.label}</p>
            {!step.done && (
              <ButtonLink href={step.href} variant={nextStep === step ? "accent" : "ghost"} size="sm">
                {nextStep === step ? "Start →" : "Go"}
              </ButtonLink>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
