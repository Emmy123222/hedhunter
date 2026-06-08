import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const ROLE_COLOR: Record<string, "muted" | "good" | "warn"> = {
  JOB_SEEKER: "muted", COMPANY: "warn", ADMIN: "good",
};

export default async function AdminUsersPage() {
  await requireAdmin();

  const snap  = await safeGet(adminCol.usersCol().orderBy("createdAt", "desc").limit(200));
  const users = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  return (
    <DashboardShell role="ADMIN" title="Users" subtitle={`${users.length} total`}>
      <div className="max-w-4xl">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
                  {["Email","Role","Joined"].map(h => (
                    <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                    <td className="py-3 px-3"><span className="text-sm font-mono" style={{ color: "#0f172a" }}>{u.email}</span></td>
                    <td className="py-3 px-3"><Badge color={ROLE_COLOR[u.role] ?? "muted"} size="xs">{u.role}</Badge></td>
                    <td className="py-3 px-3">
                      <span className="text-xs font-mono" style={{ color: "#64748b" }}>
                        {new Date(u.createdAt?.toDate?.() ?? new Date()).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"2-digit" })}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-sm" style={{ color: "#64748b" }}>No users</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
