"use client";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const CONTENT = {
  resume: {
    title: "Resume AI Processing Consent",
    description: "Before we can anonymize your resume, we need your consent to process it with AI.",
    bullets: [
      "Your resume text will be sent to an AI model to remove identifying information",
      "Names, addresses, school names, and identity markers will be replaced with 'Applicant'",
      "Your original resume is stored securely and never shared with companies",
      "Only the anonymized version is visible to employers",
    ],
  },
  audio: {
    title: "Audio Recording & Transcription Consent",
    description: "Before recording your interview, we need your consent to process your audio.",
    bullets: [
      "Your audio will be recorded and converted to text using speech-to-text AI",
      "The transcript will be anonymized before any company reviewer sees it",
      "Raw audio is never shared with companies (voice can reveal identity)",
      "You may request a written accommodation instead of audio recording",
    ],
  },
  scoring: {
    title: "AI Interview Scoring Consent",
    description: "Before we score your answers, we need your consent to use AI for evaluation.",
    bullets: [
      "Your anonymized answers will be scored by AI against the job's rubric",
      "Scores are based only on relevant qualifications and job requirements",
      "AI scores are assistive only — a human reviews all final hiring decisions",
      "You may appeal your score if you believe it is inaccurate",
    ],
  },
};

interface AIConsentBannerProps {
  type: keyof typeof CONTENT;
  onAccept: () => void;
  onDecline: () => void;
}

export function AIConsentBanner({ type, onAccept, onDecline }: AIConsentBannerProps) {
  const c = CONTENT[type];
  return (
    <Card glowTop>
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl grid place-items-center flex-none"
          style={{ background: "rgba(60,232,255,.1)", border: "1px solid rgba(60,232,255,.2)" }}>
          <ShieldCheck size={20} style={{ color: "#3ce8ff" }} />
        </div>
        <div>
          <h3 style={{ fontFamily: "Instrument Serif,serif", fontSize: 20, fontWeight: 400 }}>{c.title}</h3>
          <p className="text-sm mt-1" style={{ color: "#475569" }}>{c.description}</p>
        </div>
      </div>
      <ul className="space-y-2 mb-6">
        {c.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#475569" }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#3ce8ff" }} />
            {b}
          </li>
        ))}
      </ul>
      <p className="text-xs mb-5 p-3 rounded-lg" style={{ background: "rgba(61,220,151,.06)", border: "1px solid rgba(61,220,151,.15)", color: "#3ddc97", fontFamily: "JetBrains Mono,monospace" }}>
        Your original data is never shared with companies without your explicit consent.
      </p>
      <div className="flex gap-3">
        <Button variant="accent" onClick={onAccept}>I consent — continue</Button>
        <Button variant="ghost" onClick={onDecline}>Decline</Button>
      </div>
    </Card>
  );
}
