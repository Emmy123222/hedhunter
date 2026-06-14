import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCards } from "@/components/landing/PricingCards";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing" };

const FAQ = [
  { q: "Is the $10 annual fee refundable?", a: "The registration fee is non-refundable, but you can apply to unlimited jobs for the full year." },
  { q: "When do companies pay for job posts?", a: "You pay $50 × open positions when publishing a job post. A job with 3 open positions costs $150." },
  { q: "What happens when my subscription expires?", a: "Seekers cannot apply for new jobs. Companies cannot post new jobs. Existing applications remain active." },
  { q: "Is the $20 offer acceptance fee required?", a: "Yes — it confirms the hire and triggers the identity reveal. It is non-refundable once the company receives your contact details." },
  { q: "Are there enterprise pricing options?", a: "Contact us for volume pricing for companies posting more than 10 jobs per month." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <Navbar />
      <div className="flex justify-center pt-12 pb-2 px-6">
        <Image
          src="/HedHunhterAi 1.png"
          alt="HedHunter AI"
          width={320}
          height={320}
          priority
          style={{ width: "100%", maxWidth: 320, height: "auto", objectFit: "contain" }}
        />
      </div>
      <PricingCards />
      <section className="relative z-10 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400, marginBottom: 24, textAlign: "center" }}>
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <Card key={i} padded={false}>
                <div className="px-5 py-4">
                  <p className="font-medium text-sm mb-1.5" style={{ color: "#0f172a" }}>{f.q}</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>{f.a}</p>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center mt-10 text-xs" style={{ fontFamily: "JetBrains Mono,monospace", color: "#94a3b8" }}>
            All payments are processed securely by Stripe. Prices in USD.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
