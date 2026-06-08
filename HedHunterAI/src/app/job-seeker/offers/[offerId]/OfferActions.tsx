"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function OfferActions({ offerId }: { offerId: string }) {
  const router  = useRouter();
  const [loading, setLoading] = useState<"accept"|"decline"|null>(null);
  const [error, setError]     = useState<string | null>(null);

  async function accept() {
    setLoading("accept"); setError(null);
    try {
      const res = await fetch(`/api/stripe/checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "SEEKER_OFFER", metadata: { offerId } }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed"); setLoading(null);
    }
  }

  async function decline() {
    setLoading("decline"); setError(null);
    try {
      await fetch(`/api/offers/${offerId}/decline`, { method: "POST" });
      router.refresh();
    } catch {
      setError("Failed to decline"); setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(91,141,239,.07)", border: "1px solid rgba(91,141,239,.2)", color: "#475569" }}>
        Accepting requires a $20 offer acceptance fee. Your contact info will be shared with the company.
      </div>
      <div className="flex gap-3">
        <Button variant="accent" loading={loading === "accept"} onClick={accept} fullWidth>Accept offer ($20) →</Button>
        <Button variant="danger" loading={loading === "decline"} onClick={decline}>Decline</Button>
      </div>
      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}
    </div>
  );
}
