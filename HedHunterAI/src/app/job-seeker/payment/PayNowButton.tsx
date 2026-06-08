"use client";
import { Button } from "@/components/ui/Button";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

export function PayNowButton() {
  const { checkout, loading, error } = useStripeCheckout();
  return (
    <div className="space-y-2">
      <Button variant="accent" fullWidth loading={loading} onClick={() => checkout("seeker-annual")}>
        Pay $10 now →
      </Button>
      {error && <p className="text-xs font-mono text-center" style={{ color: "#ff5e5e" }}>{error}</p>}
      <p className="text-xs text-center" style={{ color: "#94a3b8" }}>Secure payment via Stripe. Annual renewal.</p>
    </div>
  );
}
