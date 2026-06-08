"use client";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { JobPostForm } from "@/components/company/JobPostForm";

export default function CreateJobPage() {
  const router = useRouter();

  async function handleCreate(data: Record<string, unknown>) {
    // 1. Create the job draft
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error ?? "Failed to create job post");
    }
    const { job } = await res.json();

    // 2. Open Stripe checkout for job positions
    const checkout = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "job-post", jobPostId: job.id, openPositions: data.openPositions }),
    });
    if (!checkout.ok) {
      const d = await checkout.json().catch(() => ({}));
      throw new Error(d.error ?? "Failed to start payment");
    }
    const { url } = await checkout.json();
    if (url) {
      window.location.href = url;
    } else {
      router.push(`/company/jobs/${job.id}/questions`);
    }
  }

  return (
    <DashboardShell role="COMPANY" title="Create job post" subtitle="Post a new role — you'll be taken to payment after filling in the details">
      <JobPostForm onSubmit={handleCreate} submitLabel="Pay →" />
    </DashboardShell>
  );
}
