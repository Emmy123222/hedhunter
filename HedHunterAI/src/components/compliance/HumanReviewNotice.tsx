import { Eye } from "lucide-react";
import { clsx } from "clsx";

interface HumanReviewNoticeProps {
  message?: string;
  className?: string;
}

export function HumanReviewNotice({ message, className }: HumanReviewNoticeProps) {
  return (
    <div className={clsx("flex items-start gap-3 p-4 rounded-xl", className)}
      style={{ background: "rgba(126,138,163,.07)", border: "1px solid rgba(126,138,163,.2)" }}>
      <Eye size={16} className="mt-0.5 flex-none" style={{ color: "#0f172a" }} />
      <div>
        <p className="text-sm font-medium" style={{ color: "#0f172a" }}>Human Review Required</p>
        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
          {message ?? "AI scoring is assistive only. A human reviewer will verify this decision before any action is taken."}
        </p>
      </div>
    </div>
  );
}
