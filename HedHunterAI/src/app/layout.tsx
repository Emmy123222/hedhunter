import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Hed Hunter AI — Hire what's inside", template: "%s | Hed Hunter AI" },
  description: "A merit-based employment platform. Identity stripped. Skill revealed. AI-assisted, human-reviewed, audit-logged.",
  keywords: ["merit-based hiring", "anonymous applications", "AI hiring", "bias-free recruitment"],
  openGraph: {
    title: "Hed Hunter AI",
    description: "Hire on merit, not identity.",
    url: "https://hedhunter.ai",
    siteName: "Hed Hunter AI",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-bg text-brand-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
