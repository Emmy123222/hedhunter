"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export function UserManagementTable({ users: initial }: { users: UserRow[] }) {
  const [users, setUsers] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  async function toggle(userId: string, action: "suspend" | "activate") {
    setLoading(userId);
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId }),
    });
    setUsers(u => u.map(row => row.id === userId
      ? { ...row, status: action === "suspend" ? "SUSPENDED" : "ACTIVE" }
      : row
    ));
    setLoading(null);
  }

  const ROLE_COLOR: Record<string, "muted" | "good" | "warn"> = {
    JOB_SEEKER: "muted", COMPANY: "warn", ADMIN: "good",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            {["Name / Email","Role","Status","Joined","Actions"].map(h => (
              <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <td className="py-3 px-3">
                <p className="text-sm" style={{ color: "#0f172a" }}>{u.name ?? "—"}</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: "#94a3b8" }}>{u.email}</p>
              </td>
              <td className="py-3 px-3">
                <Badge color={ROLE_COLOR[u.role] ?? "muted"} size="xs">{u.role}</Badge>
              </td>
              <td className="py-3 px-3">
                <Badge color={u.status === "ACTIVE" ? "good" : "danger"} size="xs">{u.status}</Badge>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#64748b" }}>
                  {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                </span>
              </td>
              <td className="py-3 px-3">
                {u.role !== "ADMIN" && (
                  <Button variant="ghost" size="sm" loading={loading === u.id}
                    onClick={() => toggle(u.id, u.status === "ACTIVE" ? "suspend" : "activate")}>
                    {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
