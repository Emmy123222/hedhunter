"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Job {
  id: string;
  title: string;
  isActive: boolean;
  openPositions: number;
  companyId: string;
  companyName: string;
  companyStatus: string;
}

export function AdminJobsTable({ jobs }: { jobs: Job[] }) {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(jobs.map(j => [j.companyId, j.companyStatus]))
  );
  const [loading, setLoading] = useState<string | null>(null);

  async function approve(companyId: string) {
    setLoading(companyId);
    try {
      const res = await fetch("/api/admin/approve-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });
      if (res.ok) setStatuses(p => ({ ...p, [companyId]: "APPROVED" }));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            {["Title", "Company", "Company Status", "Positions", "Action"].map(h => (
              <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <td className="py-3 px-3">
                <p className="truncate max-w-[200px]" style={{ color: "#0f172a" }}>{j.title}</p>
                <Badge color={j.isActive ? "good" : "muted"} size="xs">{j.isActive ? "Active" : "Inactive"}</Badge>
              </td>
              <td className="py-3 px-3 text-xs" style={{ color: "#475569" }}>{j.companyName}</td>
              <td className="py-3 px-3">
                <Badge color={statuses[j.companyId] === "APPROVED" ? "good" : "warn"} size="xs">
                  {statuses[j.companyId] ?? "PENDING"}
                </Badge>
              </td>
              <td className="py-3 px-3 font-mono text-xs" style={{ color: "#475569" }}>{j.openPositions}</td>
              <td className="py-3 px-3">
                {statuses[j.companyId] !== "APPROVED" ? (
                  <Button
                    size="sm" variant="accent"
                    loading={loading === j.companyId}
                    onClick={() => approve(j.companyId)}
                  >
                    Approve company
                  </Button>
                ) : (
                  <span className="text-xs font-mono" style={{ color: "#3ddc97" }}>✓ Approved</span>
                )}
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: "#64748b" }}>No job posts</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
