"use client";
import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} role="dialog" aria-modal
        className={clsx("relative w-full rounded-[17px] overflow-hidden", SIZE[size])}
        style={{ background: "linear-gradient(180deg,#f5f7fa,#0a1326)", border: "1px solid rgba(0,0,0,.11)", boxShadow: "0 40px 80px -20px rgba(0,0,0,.8)" }}>
        <span className="absolute left-0 right-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(60,232,255,.6),transparent)" }} />
        {title && (
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,.07)" }}>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: 22, fontWeight: 400 }}>{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/[.04] transition-colors" style={{ color: "#64748b" }}>
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
