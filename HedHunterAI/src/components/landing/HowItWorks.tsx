"use client";
import { useState } from "react";
import { Upload, Cpu, Star, Briefcase, Search, CheckCircle } from "lucide-react";

const SEEKER_STEPS = [
  { n: "01", icon: <Upload size={20}/>, title: "Upload your documents", desc: "Submit your resume and optional cover letter. Our AI strips all identifying information — name, age, school, address — keeping only your skills and experience." },
  { n: "02", icon: <Briefcase size={20}/>, title: "Apply & complete your interview", desc: "Browse jobs and apply. Answer timed interview questions by recording your voice or in writing. Accommodation is available for any accessibility need." },
  { n: "03", icon: <Star size={20}/>, title: "Get scored and matched", desc: "AI scores your answers against the company's rubric. A human reviews the score. You're ranked anonymously. If hired, your identity is only revealed to the employer." },
];

const COMPANY_STEPS = [
  { n: "01", icon: <Briefcase size={20}/>, title: "Post a job with your rubric", desc: "Create a job post with up to 20 interview questions. Set your ideal answers and scoring weights. Our compliance checker flags any illegal questions automatically." },
  { n: "02", icon: <Search size={20}/>, title: "Review anonymous candidates", desc: "See ranked candidates as 'Applicant #1234.' View their anonymized resume, cover letter, and scored interview transcript. Never see a name, face, or voice." },
  { n: "03", icon: <CheckCircle size={20}/>, title: "Hire on merit", desc: "Select your top candidate. Set a hire date. Upon acceptance, candidate contact details are released. Every decision is audit logged for compliance." },
];

function Step({ step }: { step: typeof SEEKER_STEPS[0] }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl grid place-items-center flex-none"
          style={{ background: "rgba(60,232,255,.08)", border: "1px solid rgba(60,232,255,.18)" }}>
          <span style={{ color: "#3ce8ff" }}>{step.icon}</span>
        </div>
        <span className="flex-1 w-px" style={{ background: "rgba(0,0,0,.06)" }} />
      </div>
      <div className="pb-8">
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, letterSpacing: ".16em", color: "#3ce8ff", textTransform: "uppercase" }}>{step.n}</p>
        <h3 style={{ fontFamily: "Instrument Serif,serif", fontSize: 20, fontWeight: 400, marginTop: 4, marginBottom: 6 }}>{step.title}</h3>
        <p className="text-sm" style={{ color: "#475569", lineHeight: 1.6 }}>{step.desc}</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [tab, setTab] = useState<"seeker" | "company">("seeker");
  const steps = tab === "seeker" ? SEEKER_STEPS : COMPANY_STEPS;

  return (
    <section className="relative z-10 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ce8ff" }}>The Process</p>
          <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, marginTop: 8, lineHeight: 1.1 }}>How it works</h2>
        </div>
        <div className="flex gap-3 mb-12 p-1.5 rounded-xl mx-auto max-w-xs"
          style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(0,0,0,.07)" }}>
          {(["seeker", "company"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 text-sm rounded-[10px] transition-all duration-200 font-medium"
              style={{
                background: tab === t ? "linear-gradient(180deg,#1a2640,#f5f7fa)" : "transparent",
                color: tab === t ? "#0f172a" : "#64748b",
                boxShadow: tab === t ? "0 0 0 1px rgba(60,232,255,.2)" : "none",
              }}>
              {t === "seeker" ? "For Job Seekers" : "For Companies"}
            </button>
          ))}
        </div>
        <div>{steps.map((s, i) => <Step key={i} step={s} />)}</div>
      </div>
    </section>
  );
}
