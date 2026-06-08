import { requireAdmin } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = [
    { key: "Job seeker registration fee", value: "$10 (SEEKER_ANNUAL)" },
    { key: "Company annual subscription", value: "$100 (COMPANY_ANNUAL)" },
    { key: "Job post cost per position", value: "$50 (COMPANY_JOB_POST)" },
    { key: "Offer acceptance fee", value: "$20 (SEEKER_OFFER)" },
    { key: "Max interview questions per job", value: "20" },
    { key: "AI anonymization confidence threshold", value: "0.85 (flags <0.85 for review)" },
    { key: "Bias word detection", value: "Enabled — checks all interview questions" },
    { key: "EEOC compliance", value: "Enforced — 7 protected characteristics" },
    { key: "EU AI Act", value: "Enforced — human review required for high-risk AI decisions" },
    { key: "NYC LL 144", value: "Enforced — annual bias audit required" },
    { key: "GDPR", value: "Enforced — consent required before processing" },
  ];

  return (
    <DashboardShell role="ADMIN" title="Platform settings" subtitle="Read-only configuration overview">
      <div className="max-w-2xl">
        <Card>
          <p className="font-mono text-[10.5px] tracking-[.14em] uppercase mb-4" style={{ color: "#64748b" }}>
            Platform configuration
          </p>
          <div className="space-y-3">
            {settings.map(s => (
              <div key={s.key} className="flex items-start justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                <span className="text-sm" style={{ color: "#475569" }}>{s.key}</span>
                <span className="font-mono text-xs flex-none text-right max-w-[200px]" style={{ color: "#0f172a" }}>{s.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono mt-4" style={{ color: "#94a3b8" }}>
            These settings are configured via environment variables and code. Contact the engineering team to change them.
          </p>
        </Card>
      </div>
    </DashboardShell>
  );
}
