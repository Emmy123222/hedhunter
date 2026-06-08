export type ApplicationStatus =
  | "DRAFT" | "SUBMITTED" | "REVIEWING" | "SHORTLISTED"
  | "OFFER_SENT" | "HIRED" | "REJECTED" | "APPEALING";

export interface Application {
  id:                    string;
  jobSeekerId:           string;
  jobPostId:             string;
  anonymousCode:         string;
  status:                ApplicationStatus;
  totalScore?:           number | null;
  aiConfidence?:         number | null;
  requiresHumanReview:   boolean;
  accommodationRequested:boolean;
  accommodationType?:    string | null;
  identityUnsealed:      boolean;
  unsealedAt?:           Date | null;
  hireDate?:             Date | null;
  createdAt:             Date;
  updatedAt:             Date;
}

export interface ApplicationWithDetails extends Application {
  jobPost: {
    title:   string;
    company: { name: string; logo?: string | null; };
  };
  aiScores:  AIScoreResult[];
  offers:    Offer[];
  appeals:   Appeal[];
}

export interface Offer {
  id:            string;
  applicationId: string;
  hireDate:      Date;
  salary?:       number | null;
  message?:      string | null;
  isAccepted?:   boolean | null;
  acceptedAt?:   Date | null;
  paymentDone:   boolean;
  createdAt:     Date;
}

export interface Appeal {
  id:            string;
  applicationId: string;
  reason:        string;
  status:        string;
  reviewerNotes?: string | null;
  resolvedAt?:   Date | null;
  createdAt:     Date;
}

import type { AIScoreResult } from "./ai";
