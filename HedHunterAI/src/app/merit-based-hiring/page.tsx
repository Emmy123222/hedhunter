import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Scale, FileCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Merit Based Hiring Pledge" };

const REGS = [
  { name: "Title VII (US)", desc: "Prohibits employment discrimination based on race, color, religion, sex, or national origin." },
  { name: "EEOC Guidelines", desc: "Equal Employment Opportunity Commission guidelines covering all aspects of employment." },
  { name: "EU AI Act", desc: "Requires AI hiring tools to be transparent, auditable, and non-discriminatory." },
  { name: "NYC Local Law 144", desc: "Requires bias audits for AI tools used in employment decisions in New York City." },
  { name: "GDPR", desc: "Governs how personal data is collected, processed, and stored for EU citizens." },
  { name: "ADA / Section 508", desc: "Requires accommodation for applicants with disabilities, including interview accommodations." },
];

export default function MeritBasedHiringPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <Navbar />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: "rgba(61,220,151,.1)", border: "1px solid rgba(61,220,151,.2)" }}>
            <ShieldCheck size={30} style={{ color: "#3ddc97" }} />
          </div>
          <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 400, lineHeight: 1.05 }}>
            The Merit Based Hiring Pledge
          </h1>
          <p className="mt-4 text-base max-w-2xl mx-auto" style={{ color: "#475569", lineHeight: 1.6 }}>
            Every company on Hed Hunter AI is required to sign and uphold this pledge before posting jobs.
          </p>
        </div>

        <Card glowTop className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Scale size={24} style={{ color: "#3ddc97" }} className="flex-none mt-1" />
            <div>
              <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>The Pledge</h2>
              <blockquote className="text-base leading-relaxed italic" style={{ color: "#0f172a", borderLeft: "3px solid rgba(61,220,151,.4)", paddingLeft: 16 }}>
                "We are a merit-based company and do not discriminate based on a job seeker&apos;s age, race, gender, disability, religion, nationality, or sexual orientation. We commit to reviewing all candidates based solely on relevant skills, experience, and qualifications as assessed through our defined rubric."
              </blockquote>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "rgba(61,220,151,.06)", border: "1px solid rgba(61,220,151,.15)" }}>
            <p className="text-sm" style={{ color: "#3ddc97", fontFamily: "JetBrains Mono,monospace", fontSize: 10.5 }}>
              MERIT BASED PLEDGE VERIFIED — enforced through AI anonymization, rubric-only scoring, audit logs, and human review requirements.
            </p>
          </div>
        </Card>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FileCheck size={20} style={{ color: "#5b8def" }} />
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 26, fontWeight: 400 }}>Compliance framework</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {REGS.map(r => (
              <Card key={r.name} padded={false} hover>
                <div className="px-5 py-4">
                  <p className="font-mono text-xs mb-1.5" style={{ color: "#3ce8ff", letterSpacing: ".1em" }}>{r.name}</p>
                  <p className="text-sm" style={{ color: "#475569" }}>{r.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
