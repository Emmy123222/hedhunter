"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CompanyRow {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  meritPledgeSigned: boolean;
  approvalStatus: string;
  createdAt: string;
  userId: string;
}

export function CompanyApprovalTable({ companies: initial }: { companies: CompanyRow[] }) {
  const [companies, setCompanies] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  async function approve(companyId: string) {
    setLoading(companyId);
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve-company", targetId: companyId }),
    });
    setCompanies(c => c.map(row => row.id === companyId ? { ...row, approvalStatus: "APPROVED" } : row));
    setLoading(null);
  }

  const STATUS_COLOR: Record<string, "warn" | "good" | "danger"> = {
    PENDING: "warn", APPROVED: "good", SUSPENDED: "danger",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            {["Company","Industry","Pledge","Status","Joined","Actions"].map(h => (
              <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <td className="py-3 px-3">
                <p style={{ color: "#0f172a" }}>{c.name}</p>
                {c.website && <p className="text-xs font-mono mt-0.5 truncate max-w-[180px]" style={{ color: "#94a3b8" }}>{c.website}</p>}
              </td>
              <td className="py-3 px-3"><span className="text-xs" style={{ color: "#475569" }}>{c.industry ?? "—"}</span></td>
              <td className="py-3 px-3">
                <Badge color={c.meritPledgeSigned ? "good" : "danger"} size="xs">{c.meritPledgeSigned ? "Signed" : "Missing"}</Badge>
              </td>
              <td className="py-3 px-3">
                <Badge color={STATUS_COLOR[c.approvalStatus] ?? "muted"} size="xs">{c.approvalStatus}</Badge>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#64748b" }}>
                  {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </td>
              <td className="py-3 px-3">
                {c.approvalStatus === "PENDING" && (
                  <Button variant="ghost" size="sm" loading={loading === c.id}
                    onClick={() => approve(c.id)}>
                    Approve
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {companies.length === 0 && (
            <tr><td colSpan={6} className="py-8 text-center text-sm" style={{ color: "#64748b" }}>No companies yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
