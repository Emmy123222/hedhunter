import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { AuditLogTable } from "@/components/admin/AuditLogTable";

export default async function AuditLogsPage() {
  await requireAdmin();
  const snap = await safeGet(adminCol.auditLogs().orderBy("createdAt", "desc").limit(200));

  const rows = snap.docs.map(d => {
    const l = d.data();
    return {
      id:         d.id,
      actorId:    l.actorId ?? "system",
      action:     l.action,
      entityType: l.targetType ?? "—",
      entityId:   l.targetId ?? "—",
      details:    (l.metadata ?? {}) as Record<string, unknown>,
      createdAt:  l.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    };
  });

  return (
    <DashboardShell role="ADMIN" title="Audit logs" subtitle={`Last ${rows.length} events`}>
      <div className="max-w-6xl">
        <Card><AuditLogTable logs={rows} /></Card>
      </div>
    </DashboardShell>
  );
}
