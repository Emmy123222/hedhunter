"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface HireCandidateFormProps {
  applicationId: string;
  applicantCode: string;
  onHired: (candidateName: string) => void;
}

export function HireCandidateForm({ applicationId, applicantCode, onHired }: HireCandidateFormProps) {
  const [startDate, setStartDate]     = useState("");
  const [confirmed, setConfirmed]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [revealedName, setRevealedName] = useState<string | null>(null);

  async function handleHire() {
    if (!startDate) { setError("Start date is required."); return; }
    if (!confirmed) { setError("Please confirm the hire decision."); return; }
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}/hire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Hire failed");
      }
      const data = await res.json();
      setRevealedName(data.candidateName);
      onHired(data.candidateName);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Hire failed");
    } finally {
      setSaving(false);
    }
  }

  if (revealedName) {
    return (
      <div className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: "rgba(61,220,151,.06)", border: "1px solid rgba(61,220,151,.25)" }}>
        <ShieldCheck size={18} style={{ color: "#3ddc97", marginTop: 1 }}/>
        <div>
          <p className="text-sm font-medium" style={{ color: "#0f172a" }}>Hire confirmed</p>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
            Candidate identity revealed: <strong style={{ color: "#0f172a" }}>{revealedName}</strong>
          </p>
          <p className="text-xs mt-1 font-mono" style={{ color: "#64748b" }}>An offer has been sent. This action is recorded in the audit log.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg flex items-start gap-2.5"
        style={{ background: "rgba(245,197,24,.06)", border: "1px solid rgba(245,197,24,.2)" }}>
        <AlertTriangle size={14} style={{ color: "#f5c518", marginTop: 1 }}/>
        <p className="text-xs" style={{ color: "#475569" }}>
          Hiring <strong style={{ color: "#0f172a" }}>{applicantCode}</strong> will reveal their identity, create an offer record, and notify them via email. This action is final and audited.
        </p>
      </div>

      <Input
        label="Expected start date"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        required
      />

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-[#3ddc97] flex-none" />
        <span className="text-xs" style={{ color: "#475569" }}>
          I confirm this hire decision is based solely on merit and the candidate's scores, in accordance with the Merit Based Hiring Pledge.
        </span>
      </label>

      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}

      <Button variant="accent" loading={saving} onClick={handleHire} fullWidth>
        Confirm hire & reveal identity
      </Button>
    </div>
  );
}
