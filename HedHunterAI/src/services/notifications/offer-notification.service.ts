import { adminCol } from "@/lib/db-admin";
import { sendOfferEmail } from "@/lib/email";

export async function notifyOfferSent(offerId: string): Promise<void> {
  const offerSnap  = await adminCol.offers(offerId).get();
  if (!offerSnap.exists) return;
  const offer      = offerSnap.data()!;
  const appSnap    = await adminCol.applications(offer.applicationId).get();
  if (!appSnap.exists) return;
  const seekerSnap = await adminCol.users(appSnap.data()!.jobSeekerId).get();
  const email      = seekerSnap.data()?.email;
  if (email) await sendOfferEmail(email, {
    applicantCode: appSnap.data()?.anonymousCode ?? "Applicant",
    jobTitle:      "your position",
    companyName:   "",
    hireDate:      (offer.hireDate?.toDate?.() ?? new Date()).toLocaleDateString(),
  });
}

export async function notifyOfferAccepted(applicationId: string): Promise<void> {
  // No-op until sendHireConfirmationEmail is added to email.ts
}

export async function notifyHireConfirmed(applicationId: string): Promise<void> {
  await notifyOfferAccepted(applicationId);
}
