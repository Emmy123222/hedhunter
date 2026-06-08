import type { AuditAction } from "@/lib/audit-log";

export type { AuditAction };

export interface AuditLog {
  id:          string;
  actorId?:    string | null;
  actorType:   string;
  action:      AuditAction;
  targetId?:   string | null;
  targetType?: string | null;
  metadata?:   Record<string, unknown> | null;
  ipAddress?:  string | null;
  confidence?: number | null;
  status:      string;
  createdAt:   any;
  actor?:      { email: string } | null;
}

export interface AdminStats {
  totalUsers:        number;
  totalSeekers:      number;
  totalCompanies:    number;
  totalJobs:         number;
  totalRevenueCents: number;
  pendingCompanies:  number;
  openAppeals:       number;
  flaggedQuestions:  number;
}
