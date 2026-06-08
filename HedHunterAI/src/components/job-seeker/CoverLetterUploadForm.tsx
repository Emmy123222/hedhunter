"use client";
import { useState } from "react";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";

interface CoverLetterUploadFormProps {
  onComplete?: (docId: string) => void;
}

export function CoverLetterUploadForm({ onComplete }: CoverLetterUploadFormProps) {
  const [file, setFile]           = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file); fd.append("type", "cover-letter");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { id: documentId } = await res.json();
      if (!documentId) throw new Error("Upload did not return a document ID");

      await fetch("/api/anonymize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, type: "cover-letter" }),
      });

      setDone(true);
      onComplete?.(documentId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (done) {
    return (
      <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(61,220,151,.07)", border: "1px solid rgba(61,220,151,.2)", color: "#3ddc97" }}>
        Cover letter uploaded and anonymized successfully.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FileUploader
        accept={{ "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
        onFile={setFile}
        selectedFile={file}
        onClear={() => setFile(null)}
        label="Cover Letter (PDF or DOCX, optional)"
        hint="Identity will be anonymized before employer review."
        maxSizeMB={5}
      />
      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}
      <Button variant="ghost" loading={uploading} disabled={!file} onClick={handleUpload} fullWidth>
        {uploading ? "Uploading…" : "Upload cover letter"}
      </Button>
    </div>
  );
}
