import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminJobsPage() {
  await requireAdmin();

  const snap = await safeGet(adminCol.jobPostsCol().orderBy("createdAt", "desc").limit(200));
  const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  return (
    <DashboardShell role="ADMIN" title="All job posts" subtitle={`${jobs.length} total`}>
      <div className="max-w-5xl">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
                  {["Title","Status","Positions"].map(h => (
                    <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((j: any) => (
                  <tr key={j.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                    <td className="py-3 px-3"><p className="truncate max-w-[280px]" style={{ color: "#0f172a" }}>{j.title}</p></td>
                    <td className="py-3 px-3"><Badge color={j.isActive ? "good" : "muted"} size="xs">{j.isActive ? "Active" : "Inactive"}</Badge></td>
                    <td className="py-3 px-3"><span className="font-mono text-xs" style={{ color: "#475569" }}>{j.openPositions}</span></td>
                  </tr>
                ))}
                {jobs.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-sm" style={{ color: "#64748b" }}>No job posts</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
