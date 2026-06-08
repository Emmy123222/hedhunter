"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Star } from "lucide-react";

interface CompanyRatingFormProps {
  companyId: string;
  companyName: string;
  onSubmit?: () => void;
}

export function CompanyRatingForm({ companyId, companyName, onSubmit }: CompanyRatingFormProps) {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [review, setReview]   = useState("");
  const [saving, setSaving]   = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit() {
    if (!rating) return;
    setSaving(true); setError(null);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, rating, review: review || undefined }),
      });
      if (!res.ok) throw new Error("Failed to submit rating");
      setDone(true);
      onSubmit?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(61,220,151,.07)", border: "1px solid rgba(61,220,151,.2)", color: "#3ddc97" }}>
        Thank you for rating {companyName}!
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#64748b", marginBottom: 12 }}>
          Rate {companyName}
        </p>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110">
              <Star size={28} fill={(hover || rating) >= n ? "#f5a524" : "transparent"}
                style={{ color: (hover || rating) >= n ? "#f5a524" : "#94a3b8" }} />
            </button>
          ))}
        </div>
      </div>
      <Textarea label="Review (optional)" value={review} onChange={e => setReview(e.target.value)}
        placeholder="Share your experience working with this company…" rows={4} />
      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}
      <Button variant="accent" disabled={!rating} loading={saving} onClick={handleSubmit}>
        Submit rating
      </Button>
    </div>
  );
}
