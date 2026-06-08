"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreProgress } from "@/components/ui/Progress";

interface AnonymizationRecord {
  id: string;
  applicantCode: string;
  confidence: number;
  flaggedTerms: string[];
  anonymizedText: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
}

export function AnonymizationReviewPanel({ records: initial }: { records: AnonymizationRecord[] }) {
  const [records, setRecords] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function approve(id: string) {
    setLoading(id);
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review-anonymization", targetId: id, approved: true }),
    });
    setRecords(r => r.map(rec => rec.id === id ? { ...rec, status: "APPROVED" as const } : rec));
    setLoading(null);
  }

  const pending = records.filter(r => r.status === "PENDING_REVIEW");

  if (pending.length === 0) {
    return <p className="text-sm font-mono py-6 text-center" style={{ color: "#64748b" }}>No pending reviews</p>;
  }

  return (
    <div className="space-y-4">
      {pending.map(rec => (
        <Card key={rec.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm" style={{ color: "#0f172a" }}>{rec.applicantCode}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge color={rec.confidence < 0.7 ? "danger" : rec.confidence < 0.85 ? "warn" : "good"} size="xs">
                  {Math.round(rec.confidence * 100)}% confidence
                </Badge>
                {rec.flaggedTerms.length > 0 && (
                  <Badge color="danger" size="xs">{rec.flaggedTerms.length} flag{rec.flaggedTerms.length !== 1 ? "s" : ""}</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}>
                {expanded === rec.id ? "Collapse" : "Review"}
              </Button>
              <Button variant="accent" size="sm" loading={loading === rec.id} onClick={() => approve(rec.id)}>
                Approve
              </Button>
            </div>
          </div>

          {expanded === rec.id && (
            <div className="mt-4 space-y-3">
              <div>
                <p className="font-mono text-[10px] tracking-[.14em] uppercase mb-1.5" style={{ color: "#64748b" }}>Confidence</p>
                <ScoreProgress score={rec.confidence * 100} />
              </div>
              {rec.flaggedTerms.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] tracking-[.14em] uppercase mb-1.5" style={{ color: "#ff5e5e" }}>Flagged terms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.flaggedTerms.map((t, i) => <Badge key={i} color="danger" size="xs">{t}</Badge>)}
                  </div>
                </div>
              )}
              <div>
                <p className="font-mono text-[10px] tracking-[.14em] uppercase mb-1.5" style={{ color: "#64748b" }}>Anonymized text</p>
                <pre className="text-xs leading-relaxed whitespace-pre-wrap p-3 rounded-lg max-h-60 overflow-y-auto"
                  style={{ background: "rgba(255,255,255,.03)", color: "#475569", fontFamily: "JetBrains Mono,monospace" }}>
                  {rec.anonymizedText}
                </pre>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
