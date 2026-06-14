import { NextRequest, NextResponse } from "next/server";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { createSessionCookie, verifySessionCookie, SESSION_COOKIE, getRoleRedirect } from "@/lib/auth";
import type { UserRole } from "@/types/user";

// Verify Firebase ID token via REST (works without service account private key)
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const { uid, email } = await verifyIdToken(body.token);

    // Read existing cookie role as a safe fallback (beats defaulting to JOB_SEEKER)
    const existingCookieRole = await (async () => {
      const existing = req.cookies.get(SESSION_COOKIE)?.value;
      if (!existing) return null;
      const parsed = await verifySessionCookie(existing);
      return parsed?.role ?? null;
    })();

    // Try to get existing role from Firestore; fall back to existing cookie role, then requested role
    let role: UserRole = (body.role as UserRole) ?? existingCookieRole ?? "JOB_SEEKER";
    try {
      const userSnap = await adminCol.users(uid).get();
      if (userSnap.exists) {
        role = (userSnap.data()?.role as UserRole) ?? role;
      } else {
        await adminCol.users(uid).set({
          uid, email, role,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch {
      // Firestore unavailable — preserve role from existing cookie so we don't downgrade to JOB_SEEKER
      console.warn("[session] Firestore unavailable — using existing session role");
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
    console.error("[auth/session POST]", err.message);
    return NextResponse.json({ error: err.message ?? "Session creation failed" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
