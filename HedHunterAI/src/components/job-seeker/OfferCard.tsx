import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Calendar, DollarSign } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

interface OfferCardProps {
  offer: {
    id: string;
    hireDate: Date;
    salary?: number | null;
    message?: string | null;
    isAccepted?: boolean | null;
    createdAt: Date;
    application: {
      jobPost: { title: string; company: { name: string } };
    };
  };
}

export function OfferCard({ offer }: OfferCardProps) {
  const status = offer.isAccepted === true ? "accepted" : offer.isAccepted === false ? "declined" : "pending";
  const color  = status === "accepted" ? "good" : status === "declined" ? "danger" : "warn";

  return (
    <Card hover padded={false}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium" style={{ color: "#0f172a" }}>{offer.application.jobPost.title}</h3>
            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{offer.application.jobPost.company.name}</p>
          </div>
          <Badge color={color}>{status.toUpperCase()}</Badge>
        </div>

        <div className="flex gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
            <Calendar size={12}/> Hire date: {formatDate(offer.hireDate)}
          </span>
          {offer.salary && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
              <DollarSign size={12}/> ${offer.salary.toLocaleString()}/yr
            </span>
          )}
        </div>

        {offer.message && (
          <p className="text-sm mb-4 italic" style={{ color: "#475569" }}>&ldquo;{offer.message}&rdquo;</p>
        )}

        {status === "pending" && (
          <ButtonLink href={`/job-seeker/offers/${offer.id}`} variant="accent" size="sm">View & respond →</ButtonLink>
        )}
      </div>
    </Card>
  );
}
