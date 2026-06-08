"use client";
import { forwardRef } from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "accent" | "ghost" | "danger" | "outline";
export type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  fullWidth?:boolean;
}

const V: Record<ButtonVariant,string> = {
  primary:"bg-[#0f172a] text-white font-semibold hover:bg-[#1e293b] hover:-translate-y-px",
  accent: "bg-gradient-to-b from-[#6797ff] to-[#3a6fe0] text-white font-medium shadow-[0_8px_22px_-8px_rgba(91,141,239,.5),inset_0_1px_0_rgba(0,0,0,.13)] hover:-translate-y-px hover:brightness-110",
  ghost:  "text-[#475569] border border-black/[.09] hover:text-[#0f172a] hover:border-black/[.16] hover:bg-black/[.04]",
  danger: "bg-[rgba(255,94,94,.08)] text-[#dc2626] border border-[rgba(255,94,94,.25)] hover:bg-[rgba(255,94,94,.15)]",
  outline:"border border-black/[.12] text-[#475569] hover:text-[#0f172a] hover:bg-black/[.04]",
};
const S: Record<ButtonSize,string> = {
  sm:"px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md:"px-4 py-2.5 text-sm rounded-[10px] gap-2",
  lg:"px-6 py-3.5 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant="ghost", size="md", loading=false, fullWidth=false, children, className, disabled, ...props }, ref) => (
    <button ref={ref} disabled={disabled||loading}
      className={clsx(
        "inline-flex items-center justify-center transition-all duration-200 whitespace-nowrap",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:!transform-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ce8ff]/40",
        V[variant], S[size], fullWidth&&"w-full", className
      )} {...props}>
      {loading&&<Loader2 size={14} className="animate-spin"/>}{children}
    </button>
  )
);
Button.displayName = "Button";

export function ButtonLink({ href, children, variant="ghost", size="md", className, fullWidth }:
  {href:string;children:React.ReactNode;variant?:ButtonVariant;size?:ButtonSize;className?:string;fullWidth?:boolean}) {
  return (
    <a href={href} className={clsx(
      "inline-flex items-center justify-center transition-all duration-200 whitespace-nowrap",
      V[variant], S[size], fullWidth&&"w-full", className
    )}>{children}</a>
  );
}
