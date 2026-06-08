"use client";
import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:string; error?:string; hint?:string; leftIcon?:React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement,InputProps>(({label,error,hint,leftIcon,className,...props},ref) => (
  <div className="flex flex-col gap-1.5">
    {label&&<label className="font-mono text-[10.5px] tracking-[.16em] uppercase text-[#64748b]">{label}</label>}
    <div className="relative">
      {leftIcon&&<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none">{leftIcon}</span>}
      <input ref={ref} className={clsx(
        "w-full bg-[#f5f7fa] border rounded-[10px] px-3 py-2.5 text-sm text-[#0f172a]",
        "placeholder:text-[#94a3b8] outline-none transition-all duration-200",
        "focus:border-[#3ce8ff]/50 focus:ring-1 focus:ring-[#3ce8ff]/20",
        error?"border-[rgba(255,94,94,.6)]":"border-black/[.09]",
        leftIcon&&"pl-9", className
      )} {...props}/>
    </div>
    {error&&<p className="text-xs text-[#ff5e5e] font-mono">{error}</p>}
    {hint&&!error&&<p className="text-xs text-[#64748b] font-mono">{hint}</p>}
  </div>
));
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:string; error?:string; hint?:string;
}
export const Textarea = forwardRef<HTMLTextAreaElement,TextareaProps>(({label,error,hint,className,...props},ref) => (
  <div className="flex flex-col gap-1.5">
    {label&&<label className="font-mono text-[10.5px] tracking-[.16em] uppercase text-[#64748b]">{label}</label>}
    <textarea ref={ref} className={clsx(
      "w-full bg-[#f5f7fa] border rounded-[10px] px-3 py-2.5 text-sm text-[#0f172a] resize-y min-h-[100px]",
      "placeholder:text-[#94a3b8] outline-none transition-all duration-200",
      "focus:border-[#3ce8ff]/50 focus:ring-1 focus:ring-[#3ce8ff]/20",
      error?"border-[rgba(255,94,94,.6)]":"border-black/[.09]", className
    )} {...props}/>
    {error&&<p className="text-xs text-[#ff5e5e] font-mono">{error}</p>}
    {hint&&!error&&<p className="text-xs text-[#64748b] font-mono">{hint}</p>}
  </div>
));
Textarea.displayName = "Textarea";
