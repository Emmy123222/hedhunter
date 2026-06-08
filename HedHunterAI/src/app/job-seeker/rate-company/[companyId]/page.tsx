import { requireJobSeeker } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CompanyRatingForm } from "@/components/job-seeker/CompanyRatingForm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rate Company" };

export default async function RateCompanyPage({ params }: { params: { companyId: string } }) {
  const session  = await requireJobSeeker();
  const compSnap = await adminCol.companyProfiles(params.companyId).get();
  if (!compSnap.exists) notFound();
  const comp = compSnap.data() as any;

  const existingSnap = await adminCol.companyRatingsCol()
    .where("companyId","==",params.companyId).where("jobSeekerId","==",session.uid).limit(1).get();
  const alreadyRated = !existingSnap.empty;

  return (
    <DashboardShell role="JOB_SEEKER" title={`Rate ${comp.name}`} subtitle="Your experience matters">
      <div className="max-w-md">
        {alreadyRated ? (
          <p className="py-10 text-center text-sm" style={{ color:"#64748b" }}>You have already rated this company.</p>
        ) : (
          <CompanyRatingForm companyId={params.companyId} companyName={comp.name} />
        )}
      </div>
    </DashboardShell>
  );
}
