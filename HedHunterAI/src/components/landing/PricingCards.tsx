import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const PLANS = [
  {
    name: "Job Seeker",
    price: "$10",
    period: "/year",
    note: "+ $20 upon offer acceptance",
    href: "/signup/job-seeker",
    cta: "Start applying →",
    accent: "#3ce8ff",
    features: [
      "Anonymous profile — identity protected",
      "Apply to unlimited job positions",
      "AI-scored merit profile",
      "Timed interview with accommodation options",
      "Real-time application status",
      "Appeal AI scores with human review",
      "Company rating after hire",
    ],
  },
  {
    name: "Company",
    price: "$100",
    period: "/year",
    note: "+ $50 × open positions per job post",
    href: "/signup/company",
    cta: "Post jobs →",
    accent: "#5b8def",
    features: [
      "Unlimited anonymous candidate reviews",
      "Create up to 20 interview questions per job",
      "AI-ranked candidate leaderboard",
      "Compliance checker for interview questions",
      "Anonymized resume & transcript access",
      "One-click hire with audit log",
      "Company ratings from hired candidates",
    ],
    highlighted: true,
  },
];

function PlanCard({ plan }: { plan: typeof PLANS[0] }) {
  return (
    <Card glowTop={plan.highlighted} hover className="flex flex-col">
      {plan.highlighted && (
        <div className="flex items-center justify-center -mt-6 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono"
            style={{ background: "rgba(91,141,239,.15)", color: "#5b8def", border: "1px solid rgba(91,141,239,.3)" }}>
            For Companies
          </span>
        </div>
      )}
      <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: plan.accent }}>
        {plan.name}
      </p>
      <div className="flex items-end gap-1 mt-3 mb-1">
        <span style={{ fontFamily: "Instrument Serif,serif", fontSize: 48, lineHeight: 1, color: "#0f172a" }}>{plan.price}</span>
        <span className="mb-2 text-sm" style={{ color: "#64748b" }}>{plan.period}</span>
      </div>
      <p className="text-xs mb-6" style={{ fontFamily: "JetBrains Mono,monospace", color: "#64748b" }}>{plan.note}</p>
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#475569" }}>
            <Check size={14} className="mt-0.5 flex-none" style={{ color: plan.accent }} />
            {f}
          </li>
        ))}
      </ul>
      <ButtonLink href={plan.href} variant={plan.highlighted ? "accent" : "ghost"} fullWidth>{plan.cta}</ButtonLink>
    </Card>
  );
}

export function PricingCards() {
  return (
    <section className="relative z-10 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ce8ff" }}>Pricing</p>
          <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, marginTop: 8 }}>Simple, transparent pricing</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map(p => <PlanCard key={p.name} plan={p} />)}
        </div>
      </div>
    </section>
  );
}
