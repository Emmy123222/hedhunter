import { requireCompany } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { CompanyPayNowButton } from "./CompanyPayNowButton";

export default async function CompanyPaymentPage() {
  const session = await requireCompany();
  const snap    = await adminCol.companyProfiles(session.uid).get();
  const paid    = snap.data()?.annualPaid ?? false;

  return (
    <DashboardShell role="COMPANY" title="Subscription" subtitle="Annual company plan">
      <div className="max-w-md space-y-5">
        {paid ? (
          <Card glowTop>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={22} style={{ color: "#3ddc97" }}/>
              <div>
                <p className="font-medium" style={{ color: "#0f172a" }}>Subscription active</p>
                <p className="text-sm" style={{ color: "#64748b" }}>Annual company plan</p>
              </div>
              <Badge color="good" className="ml-auto">Active</Badge>
            </div>
            <p className="text-xs font-mono" style={{ color: "#94a3b8" }}>Renews annually. Job posts are billed separately per position ($50 each).</p>
          </Card>
        ) : (
          <Card glowTop>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={22} style={{ color: "#3ce8ff" }}/>
              <div>
                <p className="font-medium" style={{ color: "#0f172a" }}>Annual company plan</p>
                <p className="text-sm" style={{ color: "#64748b" }}>$100 / year</p>
              </div>
            </div>
            <ul className="space-y-2 mb-5">
              {["Unlimited job post drafts","AI-anonymized candidate review","Structured interview scoring","Merit-based candidate ranking","Full audit trail & compliance tools"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#475569" }}>
                  <CheckCircle size={13} style={{ color: "#3ddc97" }}/>{f}
                </li>
              ))}
            </ul>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>
              Job posts are billed separately: <strong style={{ color: "#0f172a" }}>$50 per open position</strong>.
            </p>
            <CompanyPayNowButton />
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
