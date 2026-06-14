"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";

export default function JobSeekerLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function doSession(token: string) {
    const res  = await fetch("/api/auth/session", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Sign in failed");
    if (data.role !== "JOB_SEEKER") {
      await signOut(firebaseAuth);
      throw new Error("This is a company account. Please sign in at the company login page.");
    }
    return data.redirect as string;
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred  = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const token = await cred.user.getIdToken();
      const redirect = await doSession(token);
      router.push(redirect ?? "/job-seeker/dashboard");
    } catch (err: any) { setError(err.message ?? "Sign in failed"); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred     = await signInWithPopup(firebaseAuth, provider);
      const token    = await cred.user.getIdToken();
      const redirect = await doSession(token);
      router.push(redirect ?? "/job-seeker/dashboard");
    } catch (err: any) { setError(err.message ?? "Google sign in failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#ffffff" }}>
      <div className="mb-8 text-center">
        <Image src="/HedHunhterAi 1.png" alt="HedHunter AI" width={220} height={220} style={{ width: "100%", maxWidth: 220, height: "auto", objectFit: "contain", margin: "0 auto 12px" }} />
        <Logo height={76} href="/" />
        <p className="mt-3 text-sm" style={{ color: "#64748b" }}>Job seeker sign in</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "#f5f7fa", border: "1px solid rgba(60,232,255,.15)" }}>
        {error && (
          <div className="mb-4 p-3 rounded-lg text-xs" style={{ background: "rgba(255,94,94,.12)", border: "1px solid rgba(255,94,94,.3)", color: "#ff5e5e" }}>
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
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "#e8edf5", border: "1px solid rgba(0,0,0,.09)", color: "#0f172a" }} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity"
            style={{ background: "#3ce8ff", color: "#ffffff", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Signing in…" : "Sign in"}
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

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm" style={{ color: "#64748b" }}>
          No account? <Link href="/signup/job-seeker" style={{ color: "#3ce8ff", textDecoration: "none" }}>Create job seeker account</Link>
        </p>
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          Are you a company?{" "}
          <Link href="/login/company" style={{ color: "#64748b", textDecoration: "none" }}>Company login →</Link>
        </p>
      </div>
    </div>
  );
}
