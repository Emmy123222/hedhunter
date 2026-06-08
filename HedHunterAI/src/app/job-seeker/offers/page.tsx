import { requireJobSeeker } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OfferCard } from "@/components/job-seeker/OfferCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offers" };

export default async function OffersPage() {
  const session  = await requireJobSeeker();
  const appsSnap = await safeGet(adminCol.applicationsCol().where("jobSeekerId","==",session.uid));
  const appIds   = appsSnap.docs.map(d => d.id);
  const offers: any[] = [];
  if (appIds.length) {
    const offSnap = await adminCol.offersCol().where("applicationId","in",appIds.slice(0,10)).orderBy("createdAt","desc").get();
    offers.push(...offSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  return (
    <DashboardShell role="JOB_SEEKER" title="Job Offers" subtitle={`${offers.length} offer${offers.length!==1?"s":""}`}>
      <div className="max-w-2xl space-y-4">
        {offers.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color:"#64748b" }}>No offers yet.</p>
        ) : offers.map((o:any) => <OfferCard key={o.id} offer={o} />)}
      </div>
    </DashboardShell>
  );
}
