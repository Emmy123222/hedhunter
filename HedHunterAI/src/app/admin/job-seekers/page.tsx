import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminJobSeekersPage() {
  await requireAdmin();
  const snap    = await safeGet(adminCol.jobSeekerProfilesCol().orderBy("createdAt","desc").limit(200));
  const seekers = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  return (
    <DashboardShell role="ADMIN" title="Job Seekers" subtitle={`${seekers.length} registered`}>
      <div className="max-w-4xl">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(0,0,0,.07)" }}>
                  {["Applicant Code","Registration Paid","Joined"].map(h => (
                    <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color:"#64748b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seekers.map((s:any) => (
                  <tr key={s.id} style={{ borderBottom:"1px solid rgba(0,0,0,.04)" }}>
                    <td className="py-3 px-3"><span className="font-mono text-sm" style={{ color:"#0f172a" }}>{s.applicantCode}</span></td>
                    <td className="py-3 px-3"><Badge color={s.registrationPaid?"good":"warn"} size="xs">{s.registrationPaid?"Paid":"Unpaid"}</Badge></td>
                    <td className="py-3 px-3"><span className="text-xs font-mono" style={{ color:"#64748b" }}>{new Date(s.createdAt?.toDate?.()??new Date()).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"2-digit"})}</span></td>
                  </tr>
                ))}
                {seekers.length===0 && <tr><td colSpan={3} className="py-8 text-center text-sm" style={{ color:"#64748b" }}>No job seekers</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
