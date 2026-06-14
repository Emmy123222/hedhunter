"use client";
import Link from "next/link";
import { Briefcase, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";

export default function LoginSelectorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#ffffff" }}>
      <div className="mb-10 text-center">
        <Image src="/HedHunhterAi 1.png" alt="HedHunter AI" width={220} height={220} style={{ width: "100%", maxWidth: 220, height: "auto", objectFit: "contain", margin: "0 auto 12px" }} />
        <p className="mt-3 text-sm" style={{ color: "#64748b" }}>Sign in to your account</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <Link href="/login/job-seeker"
          className="flex items-center gap-4 w-full p-5 rounded-2xl transition-all hover:scale-[1.01]"
          style={{ background: "#f5f7fa", border: "1px solid rgba(60,232,255,.18)", textDecoration: "none" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-none" style={{ background: "rgba(60,232,255,.1)" }}>
            <User size={18} style={{ color: "#3ce8ff" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#0f172a" }}>I&apos;m looking for work</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Job seeker login</p>
          </div>
          <span className="ml-auto text-lg" style={{ color: "#3ce8ff" }}>→</span>
        </Link>

        <Link href="/login/company"
          className="flex items-center gap-4 w-full p-5 rounded-2xl transition-all hover:scale-[1.01]"
          style={{ background: "#f5f7fa", border: "1px solid rgba(91,141,239,.18)", textDecoration: "none" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-none" style={{ background: "rgba(91,141,239,.1)" }}>
            <Briefcase size={18} style={{ color: "#5b8def" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#0f172a" }}>I&apos;m hiring</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Company login</p>
          </div>
          <span className="ml-auto text-lg" style={{ color: "#5b8def" }}>→</span>
        </Link>
      </div>

      <p className="mt-8 text-xs text-center" style={{ color: "#94a3b8" }}>
        No account?{" "}
        <Link href="/signup/job-seeker" style={{ color: "#64748b", textDecoration: "none" }}>Job seeker signup</Link>
        {" · "}
        <Link href="/signup/company" style={{ color: "#64748b", textDecoration: "none" }}>Company signup</Link>
      </p>
    </div>
  );
}
