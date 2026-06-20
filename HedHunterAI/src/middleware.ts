import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "hed-hunter-ai-secret-change-in-prod");
const SESSION_COOKIE = "hed-session";

const PUBLIC_PATHS = [
  "/", "/login", "/signup",
  "/pricing", "/how-it-works", "/merit-based-hiring",
  "/ai-hiring-disclosure", "/privacy", "/terms", "/about",
  "/api/auth", "/api/stripe/webhook",
  "/_next", "/favicon.ico",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Accept cookie-based session (web) or Bearer token (mobile)
  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value;
  const authHeader  = req.headers.get("authorization") ?? "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token       = cookieToken ?? bearerToken;

  // API routes with Bearer token: return 401 JSON instead of redirecting
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    // Page-level role guards (web only — API routes handle their own role checks)
    if (!pathname.startsWith("/api/")) {
      if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (pathname.startsWith("/company") && role !== "COMPANY" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (pathname.startsWith("/job-seeker") && role !== "JOB_SEEKER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
