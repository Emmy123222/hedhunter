import { requireAdmin } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { AnonymizationReviewPanel } from "@/components/admin/AnonymizationReviewPanel";

export default async function AnonymizationReviewPage() {
  await requireAdmin();

  // Query flagged resumes needing review
  const resumeSnap = await adminCol.resumeDocumentsCol().where("flaggedForReview", "==", true).limit(50).get();
  const records = await Promise.all(resumeSnap.docs.map(async d => {
    const r       = d.data();
    const profSnap = await adminCol.jobSeekerProfiles(r.jobSeekerId).get();
    return {
      id:             d.id,
      applicantCode:  profSnap.data()?.applicantCode ?? "—",
      confidence:     r.confidenceScore ?? 0,
      flaggedTerms:   [] as string[],
      anonymizedText: r.anonymizedText ?? "",
      status:         "PENDING_REVIEW" as const,
    };
  }));

  return (
    <DashboardShell role="ADMIN" title="Anonymization review"
      subtitle={`${records.length} pending review`}>
      <div className="max-w-3xl">
        <AnonymizationReviewPanel records={records} />
      </div>
    </DashboardShell>
  );
}
