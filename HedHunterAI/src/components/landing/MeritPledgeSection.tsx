import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function MeritPledgeSection() {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
          style={{ background: "rgba(61,220,151,.1)", border: "1px solid rgba(61,220,151,.2)" }}>
          <ShieldCheck size={26} style={{ color: "#3ddc97" }} />
        </div>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ddc97" }}>
          The Pledge
        </p>
        <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 400, marginTop: 8, marginBottom: 16 }}>
          Merit Based Hiring Pledge
        </h2>
        <blockquote className="text-base leading-relaxed mb-8 italic"
          style={{ color: "#475569", borderLeft: "3px solid rgba(61,220,151,.4)", paddingLeft: 20, textAlign: "left", maxWidth: 600, margin: "0 auto 32px" }}>
          "We are a merit-based company and do not discriminate based on a job seeker's age, race, gender, disability, religion, nationality, or sexual orientation."
        </blockquote>
        <p className="text-sm mb-8" style={{ color: "#64748b", maxWidth: 500, margin: "0 auto 32px" }}>
          Every company on Hed Hunter AI must sign this pledge before posting jobs. The platform enforces it through anonymization, AI scoring guardrails, and audit logging.
        </p>
        <ButtonLink href="/merit-based-hiring" variant="ghost">Read the full pledge →</ButtonLink>
      </div>
    </section>
  );
}
