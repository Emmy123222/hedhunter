import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/landing/CTASection";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  { label: "Merit first", desc: "Skills and experience are the only valid criteria for hiring decisions." },
  { label: "Radical transparency", desc: "Every AI action is logged, auditable, and explainable." },
  { label: "Structural inclusion", desc: "We don't ask for diversity pledges — we engineer bias out of the process." },
  { label: "Human accountability", desc: "AI assists. Humans decide. Every hire is reviewed by a person." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <Navbar />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-20">
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ce8ff" }}>About</p>
          <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 400, marginTop: 8, lineHeight: 1.05, letterSpacing: "-.02em" }}>
            Hiring on merit,<br /><em style={{ fontStyle: "italic" }}>not identity.</em>
          </h1>
          <p className="mt-6 text-base" style={{ color: "#475569", lineHeight: 1.7 }}>
            Unconscious bias costs talented people jobs every day — not because they lack skill, but because of names, schools, zip codes, voices, and faces. We built Hed Hunter AI to make that impossible.
          </p>
          <p className="mt-4 text-base" style={{ color: "#475569", lineHeight: 1.7 }}>
            Every resume is anonymized. Every interview is scored by rubric. Every decision is reviewed by a human. And every action is logged for compliance.
          </p>
        </div>

        <div className="mb-20">
          <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 32, fontWeight: 400, marginBottom: 16 }}>The problem</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { stat: "36%", label: "of resumes get fewer callbacks for ethnic-sounding names (Harvard / Chicago study)" },
              { stat: "79%", label: "of hiring decisions are influenced by unconscious bias in unstructured interviews" },
              { stat: "2×", label: "higher callback rates for candidates from elite universities, regardless of GPA or skill" },
            ].map(s => (
              <Card key={s.stat} hover>
                <p style={{ fontFamily: "Instrument Serif,serif", fontSize: 42, color: "#3ce8ff", lineHeight: 1, marginBottom: 8 }}>{s.stat}</p>
                <p className="text-sm" style={{ color: "#64748b", lineHeight: 1.5 }}>{s.label}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 32, fontWeight: 400, marginBottom: 16 }}>Our values</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {VALUES.map(v => (
              <Card key={v.label} padded={false} hover>
                <div className="px-5 py-4">
                  <p className="font-medium mb-1.5" style={{ color: "#0f172a" }}>{v.label}</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>{v.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <CTASection />
      <Footer />
    </div>
  );
}
