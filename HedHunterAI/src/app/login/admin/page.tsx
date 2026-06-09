"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred  = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const token = await cred.user.getIdToken();

      const res  = await fetch("/api/auth/session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sign in failed");
      if (data.role !== "ADMIN") {
        await signOut(firebaseAuth);
        throw new Error("This account does not have admin access.");
      }
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#ffffff" }}>
      <div className="mb-8 text-center">
        <Logo height={52} href="/" />
        <p className="mt-3 text-sm font-mono" style={{ color: "#64748b" }}>Admin access</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "#f5f7fa", border: "1px solid rgba(0,0,0,.07)" }}>
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
            style={{ background: "#0f172a", color: "#fff", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Signing in…" : "Sign in as admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
