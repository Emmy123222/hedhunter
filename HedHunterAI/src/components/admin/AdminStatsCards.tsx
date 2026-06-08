import { Card } from "@/components/ui/Card";

interface Stat { label: string; value: string | number; sub?: string; color?: string; }

export function AdminStatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i}>
          <p className="font-mono text-[10px] tracking-[.14em] uppercase mb-2" style={{ color: "#64748b" }}>{s.label}</p>
          <p className="text-3xl font-bold" style={{ color: s.color ?? "#0f172a" }}>{s.value}</p>
          {s.sub && <p className="text-xs font-mono mt-1" style={{ color: "#94a3b8" }}>{s.sub}</p>}
        </Card>
      ))}
    </div>
  );
}
