import { requireJobSeeker } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { PayNowButton } from "./PayNowButton";
import { Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Registration Payment" };

export default async function SeekerPaymentPage() {
  const session = await requireJobSeeker();
  const snap    = await adminCol.jobSeekerProfiles(session.uid).get();
  const paid    = snap.data()?.registrationPaid ?? false;

  if (paid) {
    return (
      <DashboardShell role="JOB_SEEKER" title="Registration">
        <Card glowTop className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "rgba(61,220,151,.1)", border: "1px solid rgba(61,220,151,.2)" }}>
              <Check size={20} style={{ color: "#3ddc97" }}/>
            </div>
            <div>
              <p className="font-medium" style={{ color: "#0f172a" }}>Registration complete</p>
              <p className="text-sm" style={{ color: "#64748b" }}>Your $10 annual fee is paid</p>
            </div>
          </div>
          <ButtonLink href="/job-seeker/jobs" variant="accent" fullWidth>Browse open jobs →</ButtonLink>
        </Card>
      </DashboardShell>
    );
  }

  const features = ["Apply to unlimited job positions","AI-powered anonymous merit scoring","Interview with accommodation options","Real-time application status tracking","Appeal AI scores for human review"];

  return (
    <DashboardShell role="JOB_SEEKER" title="Registration fee">
      <Card glowTop className="max-w-md">
        <div className="mb-6">
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#3ce8ff" }}>Annual registration</p>
          <div className="flex items-end gap-1.5 mt-2 mb-1">
            <span style={{ fontFamily: "Instrument Serif,serif", fontSize: 52, lineHeight: 1, color: "#0f172a" }}>$10</span>
            <span className="mb-2 text-sm" style={{ color: "#64748b" }}>/year</span>
          </div>
          <p className="text-sm" style={{ color: "#64748b" }}>One-time payment to activate your job seeker account.</p>
        </div>
        <ul className="space-y-2.5 mb-6">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: "#475569" }}>
              <Check size={13} style={{ color: "#3ce8ff" }}/>{f}
            </li>
          ))}
        </ul>
        <PayNowButton />
      </Card>
    </DashboardShell>
  );
}
