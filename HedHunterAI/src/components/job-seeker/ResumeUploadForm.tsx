"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { AnonymizedPreview } from "./AnonymizedPreview";

interface ResumeUploadFormProps {
  onComplete?: (resumeId: string) => void;
}

export function ResumeUploadForm({ onComplete }: ResumeUploadFormProps) {
  const router = useRouter();
  const [file, setFile]               = useState<File | null>(null);
  const [uploading, setUploading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [preview, setPreview]         = useState<{ anonymizedText: string; confidenceScore: number; flaggedItems: any[]; resumeId: string } | null>(null);

  async function handleUpload() {
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file); fd.append("type", "resume");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { id: documentId } = await uploadRes.json();
      if (!documentId) throw new Error("Upload did not return a document ID");

      const anonRes = await fetch("/api/anonymize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, type: "resume" }),
      });
      if (!anonRes.ok) throw new Error("Anonymization failed");
      const anon = await anonRes.json();

      setPreview({
        anonymizedText: anon.anonymizedText,
        confidenceScore: anon.confidenceScore,
        flaggedItems: anon.flaggedItems ?? [],  // may be string[] or {original,reason}[]
        resumeId: documentId,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (preview) {
    return (
      <AnonymizedPreview
        anonymizedText={preview.anonymizedText}
        confidenceScore={preview.confidenceScore}
        flaggedItems={preview.flaggedItems}
        onApprove={() => {
          onComplete?.(preview.resumeId);
          router.push("/job-seeker/anonymized-preview");
        }}
        onRequestReanonymization={() => setPreview(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <FileUploader
        accept={{ "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
        onFile={setFile}
        selectedFile={file}
        onClear={() => setFile(null)}
        label="Resume (PDF or DOCX)"
        hint="Your identity will be stripped before any employer sees this."
        maxSizeMB={10}
      />
      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}
      <Button variant="accent" loading={uploading} disabled={!file} onClick={handleUpload} fullWidth>
        {uploading ? "Uploading & anonymizing…" : "Upload & anonymize"}
      </Button>
    </div>
  );
}
