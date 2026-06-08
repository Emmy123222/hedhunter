import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [userSnap, seekerSnap, companySnap] = await Promise.all([
    adminCol.users(session.uid).get(),
    adminCol.jobSeekerProfiles(session.uid).get(),
    adminCol.companyProfiles(session.uid).get(),
  ]);

  return NextResponse.json({
    ...userSnap.data(),
    uid: session.uid,
    jobSeekerProfile: seekerSnap.exists ? seekerSnap.data() : null,
    companyProfile:   companySnap.exists ? companySnap.data() : null,
  });
}
