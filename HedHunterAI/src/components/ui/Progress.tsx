import { clsx } from "clsx";

const COLORS = {
  cyan:   { bar: "linear-gradient(90deg,#5b8def,#3ce8ff)", glow: "rgba(60,232,255,.3)" },
  good:   { bar: "linear-gradient(90deg,#22c97a,#3ddc97)", glow: "rgba(61,220,151,.3)" },
  warn:   { bar: "linear-gradient(90deg,#475569,#64748b)", glow: "rgba(100,116,139,.3)" },
  danger: { bar: "linear-gradient(90deg,#e03d3d,#ff5e5e)", glow: "rgba(255,94,94,.3)"  },
};

interface ProgressProps {
  value: number;
  color?: keyof typeof COLORS;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function Progress({ value, color = "cyan", label, showValue = false, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  const c = COLORS[color];
  return (
    <div className={clsx("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#64748b" }}>{label}</span>}
          {showValue && <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#475569" }}>{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className="rounded-full overflow-hidden" style={{ height: 5, background: "rgba(0,0,0,.06)" }}>
        <div className="animate-fill-bar h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: c.bar, boxShadow: `0 0 8px ${c.glow}` }} />
      </div>
    </div>
  );
}

export function ScoreProgress({ score, max = 5, label }: { score: number; max?: number; label?: string }) {
  const pct = (score / max) * 100;
  const color: keyof typeof COLORS = pct >= 80 ? "good" : pct >= 60 ? "cyan" : pct >= 40 ? "warn" : "danger";
  return <Progress value={pct} color={color} label={label} showValue />;
}
