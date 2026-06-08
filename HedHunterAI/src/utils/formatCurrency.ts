export function formatCurrency(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}
export function centsToDisplay(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
export function calcJobPostCost(openPositions: number): number {
  return openPositions * 5000; // $50 per position in cents
}
