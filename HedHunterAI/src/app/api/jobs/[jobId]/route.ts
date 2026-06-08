import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";

export async function GET(_req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const snap = await adminCol.jobPosts(params.jobId).get();
  if (!snap.exists || snap.data()?.companyId !== session.uid)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ job: { id: snap.id, ...snap.data() } });
}

export async function PATCH(req: Request, { params }: { params: { jobId: string } }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const snap = await adminCol.jobPosts(params.jobId).get();
  if (!snap.exists || snap.data()?.companyId !== session.uid)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, description, requiredQualifications, preferredQualifications,
          country, state, county, city, zipCode,
          isRemote, isHybrid, isOffice, salaryMin, salaryMax, openPositions, isActive } = await req.json();

  await adminCol.jobPosts(params.jobId).update({
    title, description, requiredQualifications, preferredQualifications,
    country, state, county, city, zipCode,
    isRemote, isHybrid, isOffice, salaryMin, salaryMax, openPositions,
    ...(isActive !== undefined && { isActive }),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const updated = await adminCol.jobPosts(params.jobId).get();
  return NextResponse.json({ job: { id: updated.id, ...updated.data() } });
}
