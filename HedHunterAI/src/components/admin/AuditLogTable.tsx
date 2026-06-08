interface AuditRow {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export function AuditLogTable({ logs }: { logs: AuditRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            {["Action","Entity","Actor","Details","Time"].map(h => (
              <th key={h} className="py-2.5 px-3 text-left font-mono text-[10px] tracking-[.14em] uppercase" style={{ color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id} style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <td className="py-3 px-3">
                <span className="font-mono text-xs" style={{ color: "#3ce8ff" }}>{l.action}</span>
              </td>
              <td className="py-3 px-3">
                <span className="font-mono text-[10px]" style={{ color: "#64748b" }}>{l.entityType}</span>
                <span className="font-mono text-[10px] ml-1 truncate max-w-[100px] block" style={{ color: "#94a3b8" }}>{l.entityId.slice(0, 8)}…</span>
              </td>
              <td className="py-3 px-3">
                <span className="font-mono text-[10px] truncate max-w-[100px] block" style={{ color: "#94a3b8" }}>{l.actorId.slice(0, 12)}…</span>
              </td>
              <td className="py-3 px-3 max-w-[200px]">
                <span className="text-xs font-mono break-all" style={{ color: "#64748b" }}>
                  {JSON.stringify(l.details).slice(0, 60)}{JSON.stringify(l.details).length > 60 ? "…" : ""}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>
                  {new Date(l.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: "#64748b" }}>No audit logs</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
