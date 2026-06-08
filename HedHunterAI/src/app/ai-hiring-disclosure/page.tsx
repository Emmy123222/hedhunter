import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Cpu, ShieldOff, Eye, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Hiring Disclosure" };

export default function AIHiringDisclosurePage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <Navbar />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ce8ff" }}>Transparency</p>
          <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 400, marginTop: 8 }}>
            AI Hiring Disclosure
          </h1>
          <p className="mt-4 text-base max-w-2xl mx-auto" style={{ color: "#475569", lineHeight: 1.6 }}>
            As required by NYC Local Law 144 and the EU AI Act, we disclose how AI is used in our hiring process.
          </p>
        </div>

        <div className="space-y-6">
          <Card glowTop>
            <div className="flex items-center gap-3 mb-4">
              <Cpu size={20} style={{ color: "#3ce8ff" }} />
              <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 22, fontWeight: 400 }}>What our AI does</h2>
            </div>
            <ul className="space-y-2.5">
              {["Removes identifying information from resumes, cover letters, and transcripts","Scores interview answers 0–5 against the employer's written rubric","Ranks candidates by total score to assist human reviewers","Flags low-confidence decisions for mandatory human review","Checks interview questions for potential legal compliance issues"].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#475569" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#3ce8ff" }} />{t}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <ShieldOff size={20} style={{ color: "#ff5e5e" }} />
              <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 22, fontWeight: 400 }}>What our AI never considers</h2>
            </div>
            <ul className="space-y-2.5">
              {["Name, gender, age, race, ethnicity, nationality","Voice quality, accent, speaking speed, or audio characteristics","School prestige or geographic location","Physical appearance, photos, or any visual information","Grammar unrelated to the specific job requirements","Protected characteristics under Title VII, EEOC, ADA, and EU AI Act"].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#475569" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#ff5e5e" }} />{t}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Eye size={20} style={{ color: "#f5a524" }} />
              <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 22, fontWeight: 400 }}>Human oversight</h2>
            </div>
            <p className="text-sm mb-3" style={{ color: "#475569", lineHeight: 1.6 }}>
              AI scores are <strong style={{ color: "#0f172a" }}>assistive recommendations only</strong>. Every final hire or reject decision requires a human reviewer. When AI confidence falls below 75%, human review is mandatory and the decision cannot be automated.
            </p>
            <p className="text-sm" style={{ color: "#475569", lineHeight: 1.6 }}>
              All AI actions — anonymization, scoring, ranking — are logged in an immutable audit trail that admins and regulators can inspect.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={20} style={{ color: "#3ddc97" }} />
              <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 22, fontWeight: 400 }}>Your rights</h2>
            </div>
            <ul className="space-y-2.5">
              {["Appeal any AI score you believe is inaccurate","Request accommodation for timed interview (untimed/written options available)","Request human review of your anonymization","Access your own audit log","Request data deletion under GDPR/CCPA"].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#475569" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#3ddc97" }} />{t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
