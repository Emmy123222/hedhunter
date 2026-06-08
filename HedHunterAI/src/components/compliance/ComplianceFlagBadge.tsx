import { Badge } from "@/components/ui/Badge";

interface ComplianceFlagBadgeProps {
  isFlagged: boolean;
  flagReason?: string;
}

export function ComplianceFlagBadge({ isFlagged, flagReason }: ComplianceFlagBadgeProps) {
  if (isFlagged) {
    return (
      <span title={flagReason ?? "Flagged for compliance review"}>
        <Badge color="danger" dot>Flagged</Badge>
      </span>
    );
  }
  return <Badge color="good" dot>Compliant</Badge>;
}
