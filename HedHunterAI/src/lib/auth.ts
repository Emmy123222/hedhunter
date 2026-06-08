import { adminCol, FieldValue } from "./db-admin";
import { ROUTES } from "./constants";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types/user";

const SESSION_COOKIE = "hed-session";
const JWT_SECRET     = new TextEncoder().encode(process.env.JWT_SECRET ?? "hed-hunter-ai-secret-change-in-prod");
const SESSION_TTL    = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  uid:   string;
  email: string;
  role:  UserRole;
}

// ─── session cookie ─────────────────────────────────────────────────────────
export async function createSessionCookie(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionCookie(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  // Cookie-based session (web)
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (cookieToken) return verifySessionCookie(cookieToken);

  // Bearer token session (mobile)
  const headersList = await headers();
  const auth = headersList.get("authorization") ?? "";
  if (auth.startsWith("Bearer ")) {
    return verifySessionCookie(auth.slice(7));
  }

  return null;
}

// ─── server component helpers ────────────────────────────────────────────────
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSessionFromCookies();
  if (!session) redirect(ROUTES.LOGIN);
  return session;
}

export async function requireRole(role: UserRole): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== role) redirect(ROUTES.HOME);
  return session;
}

export async function requireJobSeeker() { return requireRole("JOB_SEEKER"); }
export async function requireCompany()   { return requireRole("COMPANY"); }
export async function requireAdmin()     { return requireRole("ADMIN"); }

// ─── user sync (called after signup) ────────────────────────────────────────
export async function syncUserToFirestore(uid: string, email: string, role: UserRole = "JOB_SEEKER"): Promise<void> {
  const userRef = adminCol.users(uid);
  const snap    = await userRef.get();
  if (!snap.exists) {
    await userRef.set({ uid, email, role, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  } else {
    await userRef.update({ email, updatedAt: FieldValue.serverTimestamp() });
  }
  if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    const { adminAuth } = await import("./firebase-admin");
    await adminAuth.setCustomUserClaims(uid, { role });
  }
}

export function getRoleRedirect(role: UserRole): string {
  switch (role) {
    case "JOB_SEEKER": return ROUTES.JS_DASHBOARD;
    case "COMPANY":    return ROUTES.CO_DASHBOARD;
    case "ADMIN":      return ROUTES.AD_DASHBOARD;
    default:           return ROUTES.HOME;
  }
}

export { SESSION_COOKIE };
