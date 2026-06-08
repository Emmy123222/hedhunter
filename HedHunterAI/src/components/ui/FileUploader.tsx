"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { clsx } from "clsx";

interface FileUploaderProps {
  accept?: Record<string, string[]>;
  onFile: (file: File) => void;
  label?: string;
  hint?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  selectedFile?: File | null;
  onClear?: () => void;
}

export function FileUploader({ accept, onFile, label, hint, maxSizeMB = 10, disabled, selectedFile, onClear }: FileUploaderProps) {
  const onDrop = useCallback((files: File[]) => {
    if (files[0]) onFile(files[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop, accept, maxSize: maxSizeMB * 1024 * 1024, disabled, multiple: false,
  });

  const error = fileRejections[0]?.errors[0]?.message;

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between p-4 rounded-[10px]"
        style={{ border: "1px solid rgba(60,232,255,.3)", background: "rgba(60,232,255,.05)" }}>
        <div className="flex items-center gap-3">
          <File size={18} style={{ color: "#3ce8ff" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "#0f172a" }}>{selectedFile.name}</p>
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#64748b" }}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        {onClear && (
          <button onClick={onClear} className="p-1 rounded hover:bg-black/[.04] transition-colors" style={{ color: "#64748b" }}>
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {label && <p className="mb-2" style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#64748b" }}>{label}</p>}
      <div {...getRootProps()} className={clsx(
        "flex flex-col items-center justify-center gap-3 p-8 rounded-[10px] border-2 border-dashed cursor-pointer transition-all duration-200",
        isDragActive ? "border-[#3ce8ff]/60 bg-[rgba(60,232,255,.06)]" : "border-black/[.1] hover:border-black/[.16] hover:bg-black/[.03]",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        <input {...getInputProps()} />
        <Upload size={24} style={{ color: isDragActive ? "#3ce8ff" : "#64748b" }} />
        <div className="text-center">
          <p className="text-sm" style={{ color: "#475569" }}>
            {isDragActive ? "Drop file here" : "Drag & drop or click to browse"}
          </p>
          {hint && <p className="text-xs mt-1" style={{ color: "#64748b" }}>{hint}</p>}
          <p className="text-xs mt-1" style={{ fontFamily: "JetBrains Mono,monospace", color: "#94a3b8" }}>
            Max {maxSizeMB}MB
          </p>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}
    </div>
  );
}
