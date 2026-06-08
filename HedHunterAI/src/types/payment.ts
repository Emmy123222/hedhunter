export type PaymentType = "SEEKER_ANNUAL" | "SEEKER_OFFER" | "COMPANY_ANNUAL" | "COMPANY_JOB_POST";
export type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "FAILED";

export interface Payment {
  id:              string;
  userId:          string;
  type:            PaymentType;
  status:          PaymentStatus;
  amountCents:     number;
  stripePaymentId?: string | null;
  stripeInvoiceId?: string | null;
  metadata?:       Record<string, unknown> | null;
  createdAt:       Date;
}

export interface PaymentWithUser extends Payment {
  user: { email: string; role: string; };
}

export interface CheckoutPayload {
  type:       PaymentType;
  successUrl: string;
  cancelUrl:  string;
  metadata?:  Record<string, string>;
}

export interface RevenueStats {
  totalRevenueCents:    number;
  seekerPayments:       number;
  companyPayments:      number;
  refundedCents:        number;
  revenueThisMonth:     number;
  revenueLastMonth:     number;
}
