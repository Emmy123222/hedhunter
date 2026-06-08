import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { PaymentTable } from "@/components/admin/PaymentTable";

export default async function AdminPaymentsPage() {
  await requireAdmin();

  const snap    = await safeGet(adminCol.paymentsCol().orderBy("createdAt", "desc").limit(200));
  const payments = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  const rows    = payments.map((p: any) => ({
    id: p.id, amount: p.amountCents, currency: "usd", plan: p.type,
    status: p.status, createdAt: p.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    userEmail: p.userEmail ?? "—",
  }));
  const total = payments.filter((p: any) => p.status === "COMPLETED").reduce((s: number, p: any) => s + p.amountCents, 0);

  return (
    <DashboardShell role="ADMIN" title="Payments"
      subtitle={`$${(total / 100).toLocaleString()} total revenue · ${payments.length} transactions`}>
      <div className="max-w-4xl">
        <Card><PaymentTable payments={rows} /></Card>
      </div>
    </DashboardShell>
  );
}
