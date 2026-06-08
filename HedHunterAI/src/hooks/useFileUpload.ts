"use client";
import { useState, useCallback } from "react";

interface UploadState { uploading: boolean; progress: number; url: string | null; error: string | null; }

export function useFileUpload(type: "resume" | "cover-letter" | "audio") {
  const [state, setState] = useState<UploadState>({ uploading: false, progress: 0, url: null, error: null });

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setState({ uploading: true, progress: 0, url: null, error: null });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setState({ uploading: false, progress: 100, url, error: null });
      return url;
    } catch (e: any) {
      setState({ uploading: false, progress: 0, url: null, error: e.message });
      return null;
    }
  }, [type]);

  return { ...state, upload };
}
