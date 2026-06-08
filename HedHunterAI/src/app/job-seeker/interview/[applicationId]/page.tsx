"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InterviewRecorder } from "@/components/job-seeker/InterviewRecorder";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { AccommodationRequest } from "@/components/compliance/AccommodationRequest";
import { AIConsentBanner } from "@/components/compliance/AIConsentBanner";
import { CheckCircle } from "lucide-react";

interface Question {
  id: string;
  order: number;
  questionText: string;
  timeLimitSec: number;
}

export default function InterviewPage({ params }: { params: { applicationId: string } }) {
  const [questions, setQuestions]         = useState<Question[]>([]);
  const [current, setCurrent]             = useState(0);
  const [answered, setAnswered]           = useState<string[]>([]);
  const [hasAccommodation, setAccom]      = useState(false);
  const [consentGiven, setConsentGiven]   = useState(false);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    fetch(`/api/applications/${params.applicationId}/questions`)
      .then(r => r.json())
      .then(d => { setQuestions(d.questions ?? []); setLoading(false); });
  }, [params.applicationId]);

  if (loading) return (
    <DashboardShell role="JOB_SEEKER" title="Interview">
      <div className="p-8 text-center" style={{ color: "#64748b" }}>Loading questions…</div>
    </DashboardShell>
  );

  if (!consentGiven) return (
    <DashboardShell role="JOB_SEEKER" title="Interview consent">
      <div className="max-w-lg">
        <AIConsentBanner type="audio" onAccept={() => setConsentGiven(true)} onDecline={() => window.history.back()} />
      </div>
    </DashboardShell>
  );

  if (answered.length === questions.length && questions.length > 0) return (
    <DashboardShell role="JOB_SEEKER" title="Interview complete">
      <Card glowTop className="max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle size={24} style={{ color: "#3ddc97" }}/>
          <div>
            <p className="font-medium" style={{ color: "#0f172a" }}>All questions answered</p>
            <p className="text-sm" style={{ color: "#64748b" }}>Your answers are being scored.</p>
          </div>
        </div>
        <ButtonLink href={`/job-seeker/applications/${params.applicationId}`} variant="accent" fullWidth>
          View application status →
        </ButtonLink>
      </Card>
    </DashboardShell>
  );

  const q = questions[current];

  return (
    <DashboardShell role="JOB_SEEKER" title="Interview" subtitle={`${current + 1} of ${questions.length} questions`}>
      <div className="max-w-xl space-y-5">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full"
              style={{ background: i < answered.length ? "#3ddc97" : i === current ? "#3ce8ff" : "rgba(0,0,0,.09)" }}/>
          ))}
        </div>

        {q && (
          <InterviewRecorder
            question={{ ...q, totalQuestions: questions.length }}
            applicationId={params.applicationId}
            questionId={q.id}
            hasAccommodation={hasAccommodation}
            onComplete={answerId => {
              setAnswered(p => [...p, answerId]);
              setCurrent(p => p + 1);
            }}
          />
        )}

        <div id="accommodation">
          <AccommodationRequest
            applicationId={params.applicationId}
            currentAccommodation={null}
            onSave={async (type) => setAccom(type !== "")}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
