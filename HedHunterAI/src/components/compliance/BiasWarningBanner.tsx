import { AlertTriangle } from "lucide-react";

interface BiasWarningBannerProps {
  flags: Array<{ field: string; reason: string }>;
}

export function BiasWarningBanner({ flags }: BiasWarningBannerProps) {
  if (!flags.length) return null;
  return (
    <div className="p-4 rounded-xl" style={{ background: "rgba(255,94,94,.07)", border: "1px solid rgba(255,94,94,.25)" }}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} style={{ color: "#ff5e5e" }} />
        <p className="text-sm font-medium" style={{ color: "#ff5e5e" }}>Potential Bias Detected</p>
      </div>
      <ul className="space-y-1.5">
        {flags.map((f, i) => (
          <li key={i} className="text-xs" style={{ color: "#475569" }}>
            <span className="font-mono" style={{ color: "#ff5e5e" }}>{f.field}:</span> {f.reason}
          </li>
        ))}
      </ul>
      <p className="text-xs mt-3" style={{ color: "#64748b" }}>
        Questions asking about protected characteristics may violate employment law. Please review before saving.
      </p>
    </div>
  );
}
