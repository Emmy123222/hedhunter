import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";

function Dot({ color = "#3ce8ff" }: { color?: string }) {
  return <span className="inline-block rounded-full w-1.5 h-1.5 flex-none" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />;
}

function MonoLabel({ children, color = "#64748b" }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color }}>{children}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <style>{`
        @keyframes sc{0%,100%{transform:translateY(-100%)}50%{transform:translateY(100%)}}
        @keyframes fi{from{transform:scaleX(0)}}
        @keyframes sm{0%{top:-55px;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
        .sc-anim{animation:sc 3.2s ease-in-out infinite}
        .fill-anim{animation:fi 1.5s cubic-bezier(.2,.7,.2,1) both;transform-origin:left}
        .scan-anim{animation:sm 3.8s ease-in-out infinite}
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="relative z-10 pt-20 pb-12" style={{ background: "radial-gradient(1100px 500px at 80% -10%,rgba(91,141,239,.13),transparent 60%),radial-gradient(800px 400px at -5% 35%,rgba(60,232,255,.07),transparent 60%)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-7">
            <Dot /><MonoLabel>EST. 2026</MonoLabel>
            <span className="flex-1 h-px bg-white/[.07]" />
            <MonoLabel>IDENTITY LAYER :: ACTIVE</MonoLabel>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-start">
            <div>
              <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(28px,4vw,58px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 400, marginBottom: 28 }}>
                HedHunterAi —<br />
                <em style={{ fontStyle: "italic" }}>Merit-Based</em><br />
                Hiring Platform
              </h1>

              <p style={{ fontSize: 17, lineHeight: 1.55, color: "#475569", maxWidth: 540, marginBottom: 28 }}>
                Hed Hunter AI is a merit-based hiring platform that <strong style={{ color: "#0f172a", fontWeight: 500 }}>strips identity</strong> from résumés, cover letters and transcripts. Candidates are scored by AI <strong style={{ color: "#0f172a", fontWeight: 500 }}>against the company&apos;s own rubric</strong> — then a human reviews every decision.
              </p>

              <div className="flex flex-wrap gap-3 items-center mb-10">
                <Link href="/signup/job-seeker" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] text-sm font-medium text-white transition-all hover:-translate-y-px hover:brightness-110"
                  style={{ background: "linear-gradient(180deg,#6797ff,#3a6fe0)", boxShadow: "0 8px 22px -8px rgba(91,141,239,.5),inset 0 1px 0 rgba(0,0,0,.13)" }}>
                  Apply as Anonymous →
                </Link>
                <Link href="/signup/company" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm transition-all hover:bg-black/[.04] hover:text-[#0f172a]"
                  style={{ color: "#475569", border: "1px solid rgba(0,0,0,.07)" }}>
                  Hire on merit
                </Link>
                <MonoLabel>$10/yr seekers · $100/yr companies</MonoLabel>
              </div>

              <div className="grid grid-cols-3 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,.07)", maxWidth: 580 }}>
                {[{ n: "14", l: "vectors stripped per doc" }, { n: "0–5", l: "rubric-bound per Q" }, { n: "100%", l: "human-reviewed hires" }].map(s => (
                  <div key={s.l}>
                    <p style={{ fontFamily: "Instrument Serif,serif", fontSize: 38, letterSpacing: "-.02em", lineHeight: 1, color: "#3ce8ff" }}>{s.n}</p>
                    <MonoLabel>{s.l}</MonoLabel>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="flex items-center justify-center lg:justify-end">
              <Image
                src="/HedHunhterAi 1.png"
                alt="HedHunter AI"
                width={680}
                height={680}
                priority
                style={{ width: "100%", maxWidth: 680, height: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
