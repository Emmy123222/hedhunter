"use client";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck } from "lucide-react";

interface MeritPledgeCheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

const PLEDGE = `We are a merit-based company and do not discriminate based on a job seeker's age, race, gender, disability, religion, nationality, or sexual orientation. We commit to hiring all candidates based solely on relevant skills, experience, and qualifications as assessed through our defined rubric.`;

export function MeritPledgeCheckbox({ checked, onChange }: MeritPledgeCheckboxProps) {
  return (
    <div className="p-4 rounded-xl" style={{ border: `1px solid ${checked ? "rgba(61,220,151,.3)" : "rgba(0,0,0,.09)"}`, background: checked ? "rgba(61,220,151,.04)" : "rgba(0,0,0,.03)" }}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded accent-[#3ddc97] flex-none cursor-pointer" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} style={{ color: checked ? "#3ddc97" : "#94a3b8" }}/>
            <span className="text-sm font-medium" style={{ color: "#0f172a" }}>Merit Based Hiring Pledge</span>
            {checked && <Badge color="good" size="xs">Active</Badge>}
          </div>
          <p className="text-xs leading-relaxed italic" style={{ color: "#475569" }}>{PLEDGE}</p>
        </div>
      </div>
    </div>
  );
}
