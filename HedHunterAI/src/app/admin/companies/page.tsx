import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { CompanyApprovalTable } from "@/components/admin/CompanyApprovalTable";

export default async function AdminCompaniesPage() {
  await requireAdmin();

  const snap = await safeGet(adminCol.companyProfilesCol().orderBy("createdAt", "desc").limit(200));
  const rows = snap.docs.map(d => {
    const c = d.data();
    return { id: d.id, name: c.name, industry: c.industry, website: c.website,
      meritPledgeSigned: c.meritPledgeSigned, approvalStatus: c.status,
      createdAt: c.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      userId: c.uid };
  });

  return (
    <DashboardShell role="ADMIN" title="Companies" subtitle={`${rows.length} registered`}>
      <div className="max-w-5xl">
        <Card><CompanyApprovalTable companies={rows} /></Card>
      </div>
    </DashboardShell>
  );
}
