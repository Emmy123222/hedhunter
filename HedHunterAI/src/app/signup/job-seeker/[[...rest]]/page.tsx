"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";

export default function SignUpSeekerPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const register = async (uid: string, email: string, token: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, role: "JOB_SEEKER" }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error ?? "Registration failed");
    }
    router.push(ROUTES.JS_ONBOARDING);
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setError(""); setLoading(true);
    try {
      const user  = await signUp(email, password);
      const token = await user.getIdToken();
      await register(user.uid, user.email!, token);
    }
    catch (err: any) { setError(err.message ?? "Sign up failed"); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      const user  = await signInWithGoogle();
      const token = await user.getIdToken();
      await register(user.uid, user.email!, token);
    }
    catch (err: any) { setError(err.message ?? "Google sign up failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#ffffff" }}>
      <div className="mb-8 text-center">
        <Image src="/HedHunhterAi 1.png" alt="HedHunter AI" width={200} height={200} style={{ width: "100%", maxWidth: 200, height: "auto", objectFit: "contain", margin: "0 auto 12px" }} />
        <Logo height={76} href="/" />
        <p className="mt-3 text-sm" style={{ color: "#64748b" }}>Create your job seeker account</p>
      </div>

      <div className="w-full max-w-sm mb-4 p-3 rounded-xl text-xs text-center"
        style={{ background: "rgba(60,232,255,.06)", border: "1px solid rgba(60,232,255,.15)", color: "#475569", fontFamily: "JetBrains Mono,monospace" }}>
        After signup, a $10/yr registration fee unlocks job applications.
      </div>

      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "#f5f7fa", border: "1px solid rgba(0,0,0,.07)" }}>
        {error && (
          <div className="mb-4 p-3 rounded-lg text-xs text-center" style={{ background: "rgba(255,94,94,.12)", border: "1px solid rgba(255,94,94,.3)", color: "#ff5e5e" }}>
            {error}
          </div>
        )}
        <form onSubmit={handle} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs mb-1" style={{ color: "#64748b" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "#e8edf5", border: "1px solid rgba(0,0,0,.09)", color: "#0f172a" }} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "#64748b" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "#e8edf5", border: "1px solid rgba(0,0,0,.09)", color: "#0f172a" }} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "#64748b" }}>Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "#e8edf5", border: "1px solid rgba(0,0,0,.09)", color: "#0f172a" }} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity"
            style={{ background: "#3ce8ff", color: "#ffffff", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,.07)" }} />
          <span className="text-xs" style={{ color: "#94a3b8" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,.07)" }} />
        </div>

        <button onClick={handleGoogle} disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
          style={{ background: "rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.1)", color: "#0f172a", opacity: loading ? 0.6 : 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
      </div>

      <p className="mt-6 text-sm" style={{ color: "#64748b" }}>
        Already have an account? <Link href="/login/job-seeker" style={{ color: "#3ce8ff", textDecoration: "none" }}>Sign in</Link>
      </p>
      <p className="mt-2 text-xs text-center max-w-sm" style={{ color: "#94a3b8" }}>
        Looking to hire?{" "}
        <Link href="/signup/company" style={{ color: "#64748b", textDecoration: "none" }}>Register as a company →</Link>
      </p>
    </div>
  );
}
