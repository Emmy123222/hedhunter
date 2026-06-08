"use client";
import { Button } from "@/components/ui/Button";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

export function CompanyPayNowButton() {
  const { checkout, loading } = useStripeCheckout();
  return (
    <Button variant="accent" loading={loading} onClick={() => checkout("company-annual")} fullWidth>
      Subscribe — $100 / year
    </Button>
  );
}
