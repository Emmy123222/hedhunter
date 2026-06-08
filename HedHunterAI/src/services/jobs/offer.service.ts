import { adminCol, FieldValue } from "@/lib/db-admin";
import { createAuditLog } from "@/lib/audit-log";

export async function createOffer(applicationId: string, hireDate: Date, salary?: number, message?: string) {
  const ref = await adminCol.offersCol().add({
    applicationId, hireDate, salary: salary ?? null, message: message ?? null,
    isAccepted: null, paymentDone: false, createdAt: FieldValue.serverTimestamp(),
  });
  await adminCol.applications(applicationId).update({ status: "OFFER_SENT", updatedAt: FieldValue.serverTimestamp() });
  return { id: ref.id };
}

export async function acceptOffer(offerId: string, seekerUid: string) {
  await adminCol.offers(offerId).update({ isAccepted: true, acceptedAt: new Date() });
  const snap = await adminCol.offers(offerId).get();
  const applicationId = snap.data()!.applicationId;
  await adminCol.applications(applicationId).update({ status: "HIRED", hireDate: snap.data()!.hireDate, updatedAt: FieldValue.serverTimestamp() });
  await createAuditLog({ actorId: seekerUid, actorType: "USER", action: "OFFER_ACCEPTED", targetId: offerId, targetType: "Offer" });
}

export async function declineOffer(offerId: string) {
  await adminCol.offers(offerId).update({ isAccepted: false });
  const snap = await adminCol.offers(offerId).get();
  await adminCol.applications(snap.data()!.applicationId).update({ status: "REJECTED", updatedAt: FieldValue.serverTimestamp() });
}

export async function unsealCandidateIdentity(applicationId: string, unsealer: string) {
  await adminCol.applications(applicationId).update({ identityUnsealed: true, unsealedAt: new Date(), unsealedBy: unsealer, updatedAt: FieldValue.serverTimestamp() });
  await createAuditLog({ actorId: unsealer, actorType: "USER", action: "IDENTITY_UNSEALED", targetId: applicationId, targetType: "Application" });
}
