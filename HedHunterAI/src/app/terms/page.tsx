import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 24, fontWeight: 400, marginBottom: 12 }}>{title}</h2>
      <div className="text-sm space-y-3" style={{ color: "#475569", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <Navbar />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#64748b" }}>
          Last updated: May 2026
        </p>
        <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, marginTop: 8, marginBottom: 32 }}>
          Terms of Service
        </h1>

        <Section title="Acceptance of terms">
          <p>By creating an account or using Hed Hunter AI, you agree to these Terms of Service. If you do not agree, do not use the platform.</p>
        </Section>

        <Section title="Services">
          <p>Hed Hunter AI provides a merit-based hiring platform. We offer: document anonymization, AI-assisted interview scoring, job posting and application management, and payment processing. Services are provided as-is with reasonable availability.</p>
        </Section>

        <Section title="Payment terms">
          <p>Job seekers pay a $10 annual registration fee and a $20 offer acceptance fee. Companies pay a $100 annual registration fee and $50 per open position per job post. All fees are charged in USD via Stripe. Refunds are at our sole discretion except where required by law.</p>
          <p>Subscriptions renew annually. You will receive a 14-day renewal notice. You may cancel before renewal to avoid being charged.</p>
        </Section>

        <Section title="Prohibited use">
          <p>You may not: use the platform to discriminate based on protected characteristics, submit false or fraudulent applications, attempt to reverse-engineer or identify anonymized candidates, scrape or automate access to the platform, or use the platform for any illegal purpose.</p>
          <p>Companies must uphold the Merit Based Hiring Pledge at all times. Violations result in immediate account suspension without refund.</p>
        </Section>

        <Section title="Intellectual property">
          <p>You retain ownership of content you upload. You grant us a limited license to process it for the purpose of providing the service. We retain ownership of the platform, AI models, and all software.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>To the maximum extent permitted by law, Hed Hunter AI is not liable for indirect, incidental, or consequential damages. Our total liability to you does not exceed the fees you paid in the 12 months preceding the claim.</p>
          <p>AI scores are assistive recommendations, not employment decisions. We are not liable for hiring outcomes.</p>
        </Section>

        <Section title="Termination">
          <p>We may suspend or terminate accounts that violate these terms, with or without notice. You may delete your account at any time. Termination does not entitle you to a refund of fees already paid.</p>
        </Section>

        <Section title="Governing law">
          <p>These terms are governed by the laws of the State of Delaware, USA. Disputes shall be resolved by binding arbitration under AAA rules, except for injunctive relief.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these terms: legal@hedhunter.ai</p>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
