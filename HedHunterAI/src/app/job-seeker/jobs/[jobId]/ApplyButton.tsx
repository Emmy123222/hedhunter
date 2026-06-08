"use client";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function ApplyButton({ jobPostId, registrationPaid }: { jobPostId: string; registrationPaid: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  if (!registrationPaid) {
    return (
      <div className="space-y-2">
        <Button variant="accent" fullWidth disabled>Apply (registration required)</Button>
        <ButtonLink href="/job-seeker/payment" variant="ghost" fullWidth size="sm">Pay $10 to unlock applications →</ButtonLink>
      </div>
    );
  }

  async function apply() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostId }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed"); }
      const { id } = await res.json();
      router.push(`/job-seeker/applications/${id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to apply");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="accent" fullWidth loading={loading} onClick={apply}>Apply now →</Button>
      {error && <p className="text-xs font-mono text-center" style={{ color: "#ff5e5e" }}>{error}</p>}
    </div>
  );
}
