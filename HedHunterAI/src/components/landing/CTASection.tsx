import { ButtonLink } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="relative z-10 py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ce8ff" }}>
          Get started
        </p>
        <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(36px,6vw,72px)", fontWeight: 400, marginTop: 8, marginBottom: 12, lineHeight: 1.05, letterSpacing: "-.02em" }}>
          Hire what&apos;s <em style={{ fontStyle: "italic" }}>inside.</em>
        </h2>
        <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "#475569", lineHeight: 1.6 }}>
          Whether you&apos;re looking for work or building a team — skill is all that matters here.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <ButtonLink href="/signup/job-seeker" variant="accent" size="lg">Apply anonymously →</ButtonLink>
          <ButtonLink href="/signup/company" variant="ghost" size="lg">Post a job</ButtonLink>
        </div>
      </div>
    </section>
  );
}
