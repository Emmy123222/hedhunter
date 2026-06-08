import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 24, fontWeight: 400, marginBottom: 12 }}>{title}</h2>
      <div className="text-sm space-y-3" style={{ color: "#475569", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <Navbar />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#64748b" }}>
          Last updated: May 2026
        </p>
        <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, marginTop: 8, marginBottom: 32 }}>
          Privacy Policy
        </h1>

        <Section title="Data we collect">
          <p>We collect: email address (via Firebase authentication), uploaded resume and cover letter files, audio recordings of interview answers, interview transcripts, payment information (processed by Stripe — we do not store card numbers), and usage logs.</p>
          <p>We do not collect: government ID numbers, Social Security numbers, or biometric data beyond voice transcription.</p>
        </Section>

        <Section title="How we use your data">
          <p><strong style={{ color: "#0f172a" }}>Job seekers:</strong> Your documents are anonymized before companies review them. Original files are stored encrypted and inaccessible to employers. Audio is transcribed, then the transcript is anonymized. Your identity is only revealed to an employer after you accept a hire offer.</p>
          <p><strong style={{ color: "#0f172a" }}>Companies:</strong> Profile data is used to verify your identity and enforce the Merit Based Pledge. Payment data is logged for receipts and dispute resolution.</p>
        </Section>

        <Section title="Data sharing">
          <p>We do not sell your data to third parties. Data is shared with: Stripe (payment processing), Cloudinary (file storage), Groq/OpenAI (AI processing — text only, not personal metadata), Resend (transactional emails), and Firebase (authentication and database).</p>
          <p>All third-party processors are bound by data processing agreements compliant with GDPR and CCPA.</p>
        </Section>

        <Section title="Data retention">
          <p>Account data is retained for the duration of your subscription plus 90 days. Audit logs are retained for 7 years for compliance purposes. You may request deletion of personal data; audit logs are exempt from deletion requests due to legal obligations.</p>
        </Section>

        <Section title="Your rights (GDPR / CCPA)">
          <p>You have the right to: access your personal data, correct inaccurate data, delete your data (subject to legal exemptions), object to processing, request data portability, and withdraw consent.</p>
          <p>To exercise these rights, email <strong style={{ color: "#0f172a" }}>privacy@hedhunter.ai</strong>. We respond within 30 days.</p>
        </Section>

        <Section title="Cookies">
          <p>We use cookies for authentication (Clerk session cookies) and analytics (anonymous usage stats). No cross-site tracking or advertising cookies are used.</p>
        </Section>

        <Section title="Contact">
          <p>Hed Hunter AI · privacy@hedhunter.ai · For GDPR inquiries: dpo@hedhunter.ai</p>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
