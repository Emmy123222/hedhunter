"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { JobPostForm } from "@/components/company/JobPostForm";

export default function EditJobPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${params.jobId}`)
      .then(r => r.json())
      .then(d => setInitialData(d.job ?? null));
  }, [params.jobId]);

  async function handleUpdate(data: Record<string, unknown>) {
    const res = await fetch(`/api/jobs/${params.jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error ?? "Failed to update");
    }
    router.push(`/company/jobs/${params.jobId}`);
  }

  if (!initialData) return (
    <DashboardShell role="COMPANY" title="Edit job post">
      <div style={{ color: "#64748b" }} className="text-sm">Loading…</div>
    </DashboardShell>
  );

  return (
    <DashboardShell role="COMPANY" title="Edit job post">
      <JobPostForm initialData={initialData} onSubmit={handleUpdate} submitLabel="Save changes" />
    </DashboardShell>
  );
}
