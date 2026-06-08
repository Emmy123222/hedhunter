import { adminCol, FieldValue } from "@/lib/db-admin";
import { generateApplicantCode } from "@/utils/generateApplicantCode";
import { createAuditLog } from "@/lib/audit-log";

export async function createApplication(jobSeekerId: string, jobPostId: string, resumeDocId?: string, coverLetterDocId?: string) {
  const existing = await adminCol.applicationsCol()
    .where("jobSeekerId", "==", jobSeekerId)
    .where("jobPostId", "==", jobPostId).limit(1).get();
  if (!existing.empty) return { id: existing.docs[0].id, ...existing.docs[0].data() };

  const ref = await adminCol.applicationsCol().add({
    jobSeekerId, jobPostId,
    anonymousCode: generateApplicantCode(),
    status: "SUBMITTED",
    totalScore: null, aiConfidence: null,
    requiresHumanReview: false, accommodationRequested: false,
    identityUnsealed: false,
    ...(resumeDocId && { resumeDocId }),
    ...(coverLetterDocId && { coverLetterDocId }),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id };
}

export async function updateApplicationStatus(id: string, status: string, actorId?: string) {
  await adminCol.applications(id).update({ status, updatedAt: FieldValue.serverTimestamp() });
  if (actorId) {
    const action = status === "HIRED" ? "CANDIDATE_HIRED" : status === "REJECTED" ? "CANDIDATE_REJECTED" : "APPLICATION_SUBMITTED";
    await createAuditLog({ actorId, actorType: "USER", action: action as any, targetId: id, targetType: "Application" });
  }
}

export async function shortlistApplication(id: string) {
  await adminCol.applications(id).update({ status: "SHORTLISTED", updatedAt: FieldValue.serverTimestamp() });
}

export async function rejectApplication(id: string, actorId: string) {
  await adminCol.applications(id).update({ status: "REJECTED", updatedAt: FieldValue.serverTimestamp() });
  await createAuditLog({ actorId, actorType: "USER", action: "CANDIDATE_REJECTED", targetId: id, targetType: "Application" });
}
