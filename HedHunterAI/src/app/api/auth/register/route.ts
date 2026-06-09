import { NextRequest, NextResponse } from "next/server";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { createSessionCookie, SESSION_COOKIE, getRoleRedirect } from "@/lib/auth";
import { generateApplicantCode } from "@/utils/generateApplicantCode";
import type { UserRole } from "@/types/user";

async function verifyIdToken(token: string): Promise<{ uid: string; email: string }> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Token verification failed");
  }
  const data = await res.json();
  const user = data.users?.[0];
  if (!user) throw new Error("User not found");
  return { uid: user.localId, email: user.email ?? "" };
}

async function hasCompanyActivity(uid: string): Promise<boolean> {
  const profile = await adminCol.companyProfiles(uid).get();
  if (profile.data()?.annualPaid === true) return true;
  const jobs = await adminCol.jobPostsCol().where("companyId", "==", uid).limit(1).get();
  return !jobs.empty;
}

async function hasSeekerActivity(uid: string): Promise<boolean> {
  const profile = await adminCol.jobSeekerProfiles(uid).get();
  if (profile.data()?.registrationPaid === true) return true;
  const apps = await adminCol.applicationsCol().where("jobSeekerId", "==", uid).limit(1).get();
  return !apps.empty;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const { uid, email } = await verifyIdToken(body.token);
    const role: UserRole = (body.role as UserRole) ?? "JOB_SEEKER";

    try {
      const existingSnap = await adminCol.users(uid).get();

      if (existingSnap.exists) {
        const existingRole = existingSnap.data()?.role as UserRole | undefined;

        if (existingRole && existingRole !== role) {
          // Check if the existing role has any real activity
          const activity = existingRole === "JOB_SEEKER"
            ? await hasSeekerActivity(uid)
            : await hasCompanyActivity(uid);

          if (activity) {
            // User has real data in the other role — hard block
            const existingLabel = existingRole === "COMPANY" ? "a company" : "a job seeker";
            const targetPage    = existingRole === "COMPANY" ? "/login/company" : "/login/job-seeker";
            return NextResponse.json(
              { error: `This email is already registered as ${existingLabel} with an active account. Please sign in at ${targetPage}.` },
              { status: 409 }
            );
          }

          // No activity — safe to switch role. Clean up old profile.
          if (existingRole === "JOB_SEEKER") {
            await adminCol.jobSeekerProfiles(uid).delete().catch(() => {});
          } else if (existingRole === "COMPANY") {
            await adminCol.companyProfiles(uid).delete().catch(() => {});
          }
        }
      }

      // Write user doc with correct role
      await adminCol.users(uid).set({
        uid, email, role,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      // Create role-specific profile
      if (role === "JOB_SEEKER") {
        const snap = await adminCol.jobSeekerProfiles(uid).get();
        if (!snap.exists) {
          await adminCol.jobSeekerProfiles(uid).set({
            uid,
            applicantCode:    generateApplicantCode(),
            registrationPaid: false,
            createdAt:        FieldValue.serverTimestamp(),
            updatedAt:        FieldValue.serverTimestamp(),
          });
        }
      } else if (role === "COMPANY") {
        const snap = await adminCol.companyProfiles(uid).get();
        if (!snap.exists) {
          await adminCol.companyProfiles(uid).set({
            uid,
            name:              "",
            meritPledgeSigned: false,
            status:            "PENDING",
            averageRating:     0,
            totalRatings:      0,
            annualPaid:        false,
            createdAt:         FieldValue.serverTimestamp(),
            updatedAt:         FieldValue.serverTimestamp(),
          });
        }
      }
    } catch (dbErr: any) {
      console.warn("[register] Firestore write failed:", dbErr.message);
    }

    const sessionToken = await createSessionCookie({ uid, email, role });
    const res = NextResponse.json({ ok: true, role, redirect: getRoleRedirect(role), token: sessionToken });
    res.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: any) {
    console.error("[auth/register]", err.message);
    return NextResponse.json({ error: err.message ?? "Registration failed" }, { status: 500 });
  }
}
