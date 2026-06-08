import { requireCompany } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CompanyProfileForm } from "@/components/company/CompanyProfileForm";
import { CompanyRatingSummary } from "@/components/company/CompanyRatingSummary";
import { Card } from "@/components/ui/Card";

export default async function CompanyProfilePage() {
  const session = await requireCompany();
  const [profileSnap, ratingsSnap] = await Promise.all([
    adminCol.companyProfiles(session.uid).get(),
    adminCol.companyRatingsCol().where("companyId", "==", session.uid).where("isVisible", "==", true).get(),
  ]);
  const profile = profileSnap.data();
  const ratings = ratingsSnap.docs.map(d => d.data());
  const total   = ratings.length;
  const average = total > 0 ? ratings.reduce((s, r) => s + (r.rating as number), 0) / total : 0;
  const distribution: Record<number, number> = {};
  for (const r of ratings) distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;

  return (
    <DashboardShell role="COMPANY" title="Company profile" subtitle="Manage your organization details">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompanyProfileForm initialData={profile ? {
            name: profile.name, industry: profile.industry,
            website: profile.website, contactPerson: profile.contactPerson,
            contactTitle: profile.contactTitle,
            phone: profile.phone,
            city: profile.city, state: profile.state,
            county: profile.county, zipCode: profile.zipCode,
            annualRevenue: profile.annualRevenue, meritPledgeSigned: profile.meritPledgeSigned,
          } : undefined} />
        </div>
        <div>
          <Card>
            <p className="font-mono text-[10.5px] tracking-[.14em] uppercase mb-4" style={{ color: "#64748b" }}>Rating from hires</p>
            <CompanyRatingSummary total={total} average={average} distribution={distribution} />
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
