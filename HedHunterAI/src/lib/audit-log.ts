import { adminCol, FieldValue } from "./db-admin";

export type AuditAction =
  | "USER_REGISTERED" | "RESUME_UPLOADED" | "RESUME_ANONYMIZED"
  | "ANSWER_TRANSCRIBED" | "ANSWER_SCORED" | "APPLICATION_SUBMITTED"
  | "CANDIDATE_HIRED" | "CANDIDATE_REJECTED" | "OFFER_SENT"
  | "OFFER_ACCEPTED" | "PAYMENT_CHARGED" | "PAYMENT_REFUNDED"
  | "COMPANY_APPROVED" | "COMPANY_SUSPENDED" | "QUESTION_FLAGGED"
  | "APPEAL_OPENED" | "APPEAL_RESOLVED" | "ADMIN_OVERRIDE"
  | "IDENTITY_UNSEALED";

interface LogParams {
  actorId?:    string;
  actorType:   "USER" | "AI" | "SYSTEM" | "STRIPE" | "GUARD";
  action:      AuditAction;
  targetId?:   string;
  targetType?: string;
  metadata?:   Record<string, unknown>;
  ipAddress?:  string;
  confidence?: number;
  status?:     string;
}

export async function createAuditLog(params: LogParams): Promise<void> {
  await adminCol.auditLogs().add({
    ...params,
    metadata:  params.metadata ?? {},
    status:    params.status ?? "OK",
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function logAIScore(params: { applicationId: string; answerId: string; score: number; confidence: number }): Promise<void> {
  await createAuditLog({
    actorType:  "AI",
    action:     "ANSWER_SCORED",
    targetId:   params.answerId,
    targetType: "InterviewAnswer",
    confidence: params.confidence,
    status:     params.confidence < 0.8 ? "HUMAN HOLD" : "OK",
    metadata:   { applicationId: params.applicationId, score: params.score },
  });
}

export async function logAnonymization(params: { resumeId: string; confidence: number; vectors: string[] }): Promise<void> {
  await createAuditLog({
    actorType:  "AI",
    action:     "RESUME_ANONYMIZED",
    targetId:   params.resumeId,
    targetType: "ResumeDocument",
    confidence: params.confidence,
    status:     params.confidence < 0.8 ? "FLAG" : "OK",
    metadata:   { vectorsRemoved: params.vectors },
  });
}

export async function logPayment(params: { userId: string; paymentId: string; amount: number; type: string }): Promise<void> {
  await createAuditLog({
    actorId:    params.userId,
    actorType:  "STRIPE",
    action:     "PAYMENT_CHARGED",
    targetId:   params.paymentId,
    targetType: "Payment",
    metadata:   { amount: params.amount, type: params.type },
  });
}

export async function logIdentityUnseal(params: { actorId: string; applicationId: string; reason: string }): Promise<void> {
  await createAuditLog({
    actorId:    params.actorId,
    actorType:  "USER",
    action:     "IDENTITY_UNSEALED",
    targetId:   params.applicationId,
    targetType: "Application",
    status:     "OK",
    metadata:   { reason: params.reason },
  });
}
