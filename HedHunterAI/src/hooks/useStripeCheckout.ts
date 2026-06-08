"use client";
import { useState } from "react";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function checkout(type: "seeker-annual" | "seeker-offer" | "company-annual" | "job-post", meta?: Record<string, string>) {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...meta }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { checkout, loading, error };
}
