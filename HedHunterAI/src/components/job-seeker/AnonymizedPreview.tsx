"use client";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface FlaggedItem { original?: string; reason?: string }

interface AnonymizedPreviewProps {
  anonymizedText: string;
  confidenceScore: number;
  flaggedItems?: (string | FlaggedItem)[];
  onApprove: () => void;
  onRequestReanonymization: () => void;
}

export function AnonymizedPreview({ anonymizedText, confidenceScore, flaggedItems, onApprove, onRequestReanonymization }: AnonymizedPreviewProps) {
  const pct = confidenceScore * 100;
  const color = pct >= 85 ? "good" : pct >= 70 ? "warn" : "danger";

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl" style={{ border: "1px solid rgba(0,0,0,.07)", background: "rgba(0,0,0,.03)" }}>
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#64748b" }}>
            Anonymization confidence
          </p>
          <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 12, color: pct >= 85 ? "#3ddc97" : pct >= 70 ? "#f5a524" : "#ff5e5e" }}>
            {pct.toFixed(0)}%
          </span>
        </div>
        <Progress value={pct} color={color} />
      </div>

      {flaggedItems && flaggedItems.length > 0 && (
        <div className="p-4 rounded-xl" style={{ background: "rgba(245,165,36,.07)", border: "1px solid rgba(245,165,36,.2)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: "#f5a524" }} />
            <p className="text-sm font-medium" style={{ color: "#f5a524" }}>Review these uncertain removals</p>
          </div>
          <ul className="space-y-1">
            {flaggedItems.map((item, i) => {
              const label = typeof item === "string"
                ? item
                : [item.original, item.reason].filter(Boolean).join(" — ");
              return <li key={i} className="text-xs font-mono" style={{ color: "#475569" }}>· {label}</li>;
            })}
          </ul>
        </div>
      )}

      <div>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#64748b", marginBottom: 8 }}>
          Anonymized document preview
        </p>
        <div className="rounded-xl p-4 max-h-80 overflow-y-auto whitespace-pre-wrap text-xs"
          style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,.07)", fontFamily: "JetBrains Mono,monospace", color: "#475569", lineHeight: 1.6 }}>
          {anonymizedText}
        </div>
      </div>

      <div className="p-3 rounded-lg flex items-center gap-2" style={{ background: "rgba(61,220,151,.05)", border: "1px solid rgba(61,220,151,.15)" }}>
        <CheckCircle size={14} style={{ color: "#3ddc97" }} />
        <p className="text-xs" style={{ color: "#3ddc97", fontFamily: "JetBrains Mono,monospace" }}>
          Original document is stored encrypted. Only this anonymized version is shared.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="accent" onClick={onApprove}>Approve & continue</Button>
        <Button variant="ghost" onClick={onRequestReanonymization}>Re-anonymize</Button>
      </div>
    </div>
  );
}
