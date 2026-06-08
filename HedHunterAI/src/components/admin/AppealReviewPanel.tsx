"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

interface Appeal {
  id: string;
  applicantCode: string;
  reason: string;
  status: string;
  createdAt: string;
  applicationId: string;
}

export function AppealReviewPanel({ appeals: initial }: { appeals: Appeal[] }) {
  const [appeals, setAppeals] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function decide(id: string, resolution: "uphold" | "dismiss") {
    setLoading(id);
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resolve-appeal", targetId: id, resolution, notes: notes[id] ?? "" }),
    });
    setAppeals(a => a.map(ap => ap.id === id
      ? { ...ap, status: resolution === "uphold" ? "RESOLVED" : "DISMISSED" }
      : ap
    ));
    setLoading(null);
  }

  const open = appeals.filter(a => a.status === "OPEN");

  if (open.length === 0) {
    return <p className="text-sm font-mono py-6 text-center" style={{ color: "#64748b" }}>No open appeals</p>;
  }

  return (
    <div className="space-y-4">
      {open.map(ap => (
        <Card key={ap.id}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-mono text-sm" style={{ color: "#0f172a" }}>{ap.applicantCode}</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "#94a3b8" }}>
                {new Date(ap.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <Badge color="warn" size="xs">OPEN</Badge>
          </div>

          <div className="p-3 rounded-lg mb-3" style={{ background: "rgba(255,255,255,.03)" }}>
            <p className="font-mono text-[10px] tracking-[.14em] uppercase mb-1" style={{ color: "#64748b" }}>Reason</p>
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{ap.reason}</p>
          </div>

          <Textarea
            label="Admin notes (optional)"
            value={notes[ap.id] ?? ""}
            onChange={e => setNotes(n => ({ ...n, [ap.id]: e.target.value }))}
            rows={2}
          />

          <div className="flex gap-2 mt-3">
            <Button variant="accent" size="sm" loading={loading === ap.id}
              onClick={() => decide(ap.id, "uphold")}>
              Uphold appeal
            </Button>
            <Button variant="ghost" size="sm" loading={loading === ap.id}
              onClick={() => decide(ap.id, "dismiss")}>
              Dismiss
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
