"use client";
import { useRouter } from "next/navigation";
import { HireCandidateForm } from "@/components/company/HireCandidateForm";

interface Props {
  applicationId: string;
  applicantCode: string;
  jobPostId: string;
}

export function HireRedirect({ applicationId, applicantCode, jobPostId }: Props) {
  const router = useRouter();
  return (
    <HireCandidateForm
      applicationId={applicationId}
      applicantCode={applicantCode}
      onHired={() => router.push(`/company/jobs/${jobPostId}/candidates`)}
    />
  );
}
