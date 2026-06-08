import { requireCompany } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { CheckCircle, Circle } from "lucide-react";

export default async function CompanyOnboardingPage() {
  const session = await requireCompany();
  const snap    = await adminCol.companyProfiles(session.uid).get();
  const profile = snap.data();

  const steps = [
    { label: "Create account",                                 done: true,                         href: null },
    { label: "Subscribe to annual plan ($100/yr)",             done: !!profile?.annualPaid,         href: "/company/payment" },
    { label: "Complete company profile & sign merit pledge",   done: !!profile?.meritPledgeSigned,  href: "/company/profile" },
    { label: "Create your first job post",                     done: false,                         href: "/company/jobs/create" },
  ];

  const allDone = steps.every(s => s.done);

  return (
    <DashboardShell role="COMPANY" title="Get started" subtitle="Complete these steps to start hiring">
      <div className="max-w-lg space-y-5">
        <Card>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {step.done
                  ? <CheckCircle size={18} style={{ color: "#3ddc97", flexShrink: 0 }}/>
                  : <Circle size={18} style={{ color: "#94a3b8", flexShrink: 0 }}/>
                }
                <span className="flex-1 text-sm" style={{ color: step.done ? "#475569" : "#0f172a" }}>{step.label}</span>
                {!step.done && step.href && (
                  <ButtonLink href={step.href} variant="ghost" size="sm">Start →</ButtonLink>
                )}
              </div>
            ))}
          </div>
        </Card>
        {allDone && (
          <div className="p-4 rounded-xl flex items-center gap-3"
            style={{ background: "rgba(61,220,151,.06)", border: "1px solid rgba(61,220,151,.25)" }}>
            <CheckCircle size={18} style={{ color: "#3ddc97" }}/>
            <div>
              <p className="text-sm font-medium" style={{ color: "#0f172a" }}>You're all set!</p>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Your account is active and ready to hire.</p>
            </div>
          </div>
        )}
        <ButtonLink href="/company/dashboard" variant="ghost" fullWidth>Go to dashboard →</ButtonLink>
      </div>
    </DashboardShell>
  );
}
