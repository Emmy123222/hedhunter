import { requireCompany } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { HireRedirect } from "./HireRedirect";
import { notFound } from "next/navigation";

export default async function HirePage({ params }: { params: { applicationId: string } }) {
  const session  = await requireCompany();
  const appSnap  = await adminCol.applications(params.applicationId).get();
  if (!appSnap.exists) notFound();
  const jobSnap  = await adminCol.jobPosts(appSnap.data()!.jobPostId).get();
  if (!jobSnap.exists || jobSnap.data()?.companyId !== session.uid) notFound();
  const app = appSnap.data()!;
  return (
    <HireRedirect
      applicationId={params.applicationId}
      applicantCode={app.anonymousCode ?? "—"}
      jobPostId={app.jobPostId}
    />
  );
}
