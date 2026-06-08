import { clsx } from "clsx";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("w-full overflow-x-auto", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableHeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={clsx("px-4 py-3 text-left", className)}
      style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "#64748b", fontWeight: 500 }}>
      {children}
    </th>
  );
}

export function TableRow({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr onClick={onClick}
      className={clsx("transition-colors duration-150 hover:bg-black/[.03]", onClick && "cursor-pointer", className)}
      style={{ borderBottom: "1px solid rgba(0,0,0,.04)" }}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("px-4 py-3 text-sm", className)} style={{ color: "#475569" }}>{children}</td>;
}
