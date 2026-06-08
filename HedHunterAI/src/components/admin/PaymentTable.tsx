import { Badge } from "@/components/ui/Badge";

interface PaymentRow {
  id: string;
  amount: number;
  currency: string;
  plan: string;
  status: string;
  createdAt: string;
  userEmail: string;
}

export function PaymentTable({ payments }: { payments: PaymentRow[] }) {
  const STATUS_COLOR: Record<string, "warn" | "good" | "danger" | "muted"> = {
    PENDING: "warn", SUCCEEDED: "good", COMPLETED: "good", FAILED: "danger", REFUNDED: "muted",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            {["User","Plan","Amount","Status","Date"].map(h => (
              <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <td className="py-3 px-3">
                <span className="text-xs font-mono truncate max-w-[180px] block" style={{ color: "#475569" }}>{p.userEmail}</span>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#475569" }}>{p.plan}</span>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#0f172a" }}>
                  ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                </span>
              </td>
              <td className="py-3 px-3">
                <Badge color={STATUS_COLOR[p.status] ?? "muted"} size="xs">{p.status}</Badge>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#64748b" }}>
                  {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                </span>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: "#64748b" }}>No payments</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
