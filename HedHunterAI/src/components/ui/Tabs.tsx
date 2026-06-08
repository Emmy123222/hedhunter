"use client";
import { clsx } from "clsx";

interface Tab { label: string; value: string }

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={clsx("flex gap-1 p-1 rounded-xl", className)}
      style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(0,0,0,.07)" }}>
      {tabs.map(tab => (
        <button key={tab.value} onClick={() => onChange(tab.value)}
          className={clsx(
            "flex-1 px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium",
            value === tab.value
              ? "text-[#0f172a] bg-gradient-to-b from-[#1a2640] to-[#f5f7fa] shadow-sm"
              : "text-[#64748b] hover:text-[#475569] hover:bg-black/[.04]"
          )}
          style={value === tab.value ? { boxShadow: "0 0 0 1px rgba(60,232,255,.2), inset 0 1px 0 rgba(0,0,0,.06)" } : {}}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ value, active, children }: { value: string; active: string; children: React.ReactNode }) {
  return value === active ? <>{children}</> : null;
}
