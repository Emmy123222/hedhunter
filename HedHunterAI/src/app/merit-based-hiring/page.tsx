import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Merit Based Hiring Pledge" };


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


      </div>
      <Footer />
    </div>
  );
}
