import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AdminJobsTable } from "@/components/admin/AdminJobsTable";

export default async function AdminJobsPage() {
  await requireAdmin();

  const snap = await safeGet(adminCol.jobPostsCol().orderBy("createdAt", "desc").limit(200));

  const jobs = await Promise.all(snap.docs.map(async (d) => {
    const j = { id: d.id, ...d.data() } as any;
    const compSnap = await adminCol.companyProfiles(j.companyId).get();
    const comp     = compSnap.data();
    return {
      id:            j.id,
      title:         j.title ?? "",
      isActive:      j.isActive ?? false,
      openPositions: j.openPositions ?? 0,
      companyId:     j.companyId ?? "",
      companyName:   comp?.name ?? "Unknown",
      companyStatus: comp?.status ?? "PENDING",
    };
  }));

  return (
    <DashboardShell role="ADMIN" title="All job posts" subtitle={`${jobs.length} total`}>
      <div className="max-w-5xl">
        <Card><AdminJobsTable jobs={jobs} /></Card>
      </div>
    </DashboardShell>
  );
}
