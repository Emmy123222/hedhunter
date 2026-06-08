import { requireJobSeeker } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { OfferActions } from "./OfferActions";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offer Detail" };

export default async function OfferDetailPage({ params }: { params: { offerId: string } }) {
  const session  = await requireJobSeeker();
  const offerSnap = await adminCol.offers(params.offerId).get();
  if (!offerSnap.exists) notFound();
  const offer = { id: offerSnap.id, ...offerSnap.data() } as any;

  const appSnap  = await adminCol.applications(offer.applicationId).get();
  if (!appSnap.exists || appSnap.data()?.jobSeekerId !== session.uid) notFound();

  const jobSnap  = await adminCol.jobPosts(appSnap.data()!.jobPostId).get();
  const compSnap = await adminCol.companyProfiles(jobSnap.data()?.companyId ?? "").get();
  const job  = { id: jobSnap.id, ...jobSnap.data() } as any;
  const comp = compSnap.data() as any;

  return (
    <DashboardShell role="JOB_SEEKER" title="Job Offer" subtitle={job.title}>
      <div className="max-w-lg space-y-5">
        <Card glowTop>
          <p className="text-sm mb-1" style={{ color:"#64748b" }}>From</p>
          <p className="font-medium text-[#0f172a] mb-4">{comp?.name ?? "—"}</p>
          <p className="text-sm mb-1" style={{ color:"#64748b" }}>Position</p>
          <p className="font-medium text-[#0f172a] mb-4">{job.title}</p>
          <p className="text-sm mb-1" style={{ color:"#64748b" }}>Start date</p>
          <p className="font-medium text-[#0f172a] mb-4">{formatDate(offer.hireDate?.toDate?.() ?? new Date())}</p>
          {offer.salary && (
            <>
              <p className="text-sm mb-1" style={{ color:"#64748b" }}>Salary</p>
              <p className="font-medium text-[#0f172a] mb-4">${offer.salary.toLocaleString()}/yr</p>
            </>
          )}
          {offer.message && (
            <>
              <p className="text-sm mb-1" style={{ color:"#64748b" }}>Message</p>
              <p className="text-sm" style={{ color:"#475569" }}>{offer.message}</p>
            </>
          )}
        </Card>
        {offer.isAccepted === null && <OfferActions offerId={offer.id} />}
        {offer.isAccepted === true && <p className="text-[#3ddc97] font-mono text-sm">Offer accepted ✓</p>}
        {offer.isAccepted === false && <p className="text-[#ff5e5e] font-mono text-sm">Offer declined</p>}
      </div>
    </DashboardShell>
  );
}
