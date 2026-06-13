import { requireAdmin } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  await requireAdmin();

  const [usersSnap, jobsSnap, paymentsSnap, pendingSnap, appealsSnap, flagsSnap, logsSnap] = await Promise.all([
    adminCol.usersCol().get(),
    adminCol.jobPostsCol().get(),
    adminCol.paymentsCol().where("status", "==", "COMPLETED").get(),
    adminCol.companyProfilesCol().where("status", "==", "PENDING").get(),
    adminCol.appealsCol().where("status", "==", "OPEN").get(),
    adminCol.complianceFlagsCol().where("isResolved", "==", false).get(),
    adminCol.auditLogs().orderBy("createdAt", "desc").limit(8).get(),
  ]);

  const users             = usersSnap.docs.map(d => d.data());
  const totalRevenueCents = paymentsSnap.docs.reduce((s, d) => s + (d.data().amountCents ?? 0), 0);

  const stats = [
    { label:"Total Users",       value: users.length,                                  color:"#5b8def" },
    { label:"Job Seekers",       value: users.filter(u => u.role === "JOB_SEEKER").length, color:"#3ce8ff" },
    { label:"Companies",         value: users.filter(u => u.role === "COMPANY").length,    color:"#3ddc97" },
    { label:"Jobs Posted",       value: jobsSnap.size,                                 color:"#0f172a" },
    { label:"Revenue",           value: formatCurrency(totalRevenueCents),             color:"#3ddc97" },
    { label:"Pending Approvals", value: pendingSnap.size,                              color:"#0f172a" },
    { label:"Open Appeals",      value: appealsSnap.size,                              color:"#ff5e5e" },
    { label:"Flagged Questions", value: flagsSnap.size,                                color:"#0f172a" },
  ];

  const logs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  const stColor: Record<string,string> = { OK:"good", FLAG:"warn", "HUMAN HOLD":"cyan" };

  return (
    <DashboardShell role="ADMIN" title="Admin Dashboard" subtitle="Platform-wide overview">
      <div className="grid gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s=>(
            <Card key={s.label} padded={false}>
              <div className="p-5">
                <p className="font-mono text-[10px] tracking-widest uppercase mb-2.5" style={{color:"#64748b"}}>{s.label}</p>
                <p style={{fontFamily:"Instrument Serif,serif",fontStyle:"italic",fontSize:32,lineHeight:1,color:s.color}}>{s.value}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card padded={false} glowTop>
          <div className="flex items-center justify-between px-6 py-4" style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
            <h3 style={{fontFamily:"Instrument Serif,serif",fontSize:22,fontWeight:400}}>Live Audit Log</h3>
            <ButtonLink href="/admin/audit-logs" variant="ghost" size="sm">Full log <ArrowRight size={14}/></ButtonLink>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{borderBottom:"1px solid rgba(0,0,0,.07)",background:"rgba(0,0,0,.03)"}}>
                  {["Action","Actor","Target","Status"].map(h=>(
                    <th key={h} className="text-left px-4 py-3 font-mono tracking-widest uppercase" style={{color:"#64748b"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any, i: number)=>(
                  <tr key={log.id} style={{borderBottom:i<logs.length-1?"1px solid rgba(0,0,0,.07)":"none"}}>
                    <td className="px-4 py-3 font-mono text-[#0f172a]">{log.action}</td>
                    <td className="px-4 py-3 font-mono" style={{color:"#475569"}}>{log.actorType}</td>
                    <td className="px-4 py-3 font-mono" style={{color:"#475569"}}>{log.targetType??"—"}</td>
                    <td className="px-4 py-3"><Badge color={(stColor[log.status] ?? "muted") as any}>{log.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
