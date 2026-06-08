"use client";
import { clsx } from "clsx";
import { STATUS_COLORS } from "@/lib/constants";

const COLOR_MAP = {
  cyan:  {bg:"rgba(60,232,255,.09)",text:"#3ce8ff",border:"rgba(60,232,255,.22)"},
  good:  {bg:"rgba(61,220,151,.09)",text:"#3ddc97",border:"rgba(61,220,151,.22)"},
  warn:  {bg:"rgba(245,165,36,.09)",text:"#f5a524",border:"rgba(245,165,36,.22)"},
  danger:{bg:"rgba(255,94,94,.09)", text:"#ff5e5e",border:"rgba(255,94,94,.22)"},
  accent:{bg:"rgba(91,141,239,.12)",text:"#5b8def",border:"rgba(91,141,239,.3)"},
  muted: {bg:"rgba(126,138,163,.09)",text:"#64748b",border:"rgba(126,138,163,.2)"},
};
const SIZE_MAP = {xs:"text-[9.5px] px-1.5 py-0.5",sm:"text-[10.5px] px-2 py-0.5",md:"text-xs px-2.5 py-1"};

interface BadgeProps {
  status?:string; color?:keyof typeof COLOR_MAP; children:React.ReactNode;
  size?:keyof typeof SIZE_MAP; dot?:boolean; className?:string;
}

export function Badge({status,color="muted",children,size="sm",dot=false,className}:BadgeProps) {
  const s = status ? (STATUS_COLORS[status]??COLOR_MAP.muted) : COLOR_MAP[color];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded font-mono font-medium tracking-widest uppercase border",SIZE_MAP[size],className)}
      style={{background:s.bg,color:s.text,borderColor:s.border}}>
      {dot&&<span className="w-1.5 h-1.5 rounded-full flex-none" style={{background:s.text,boxShadow:`0 0 6px ${s.text}`}}/>}
      {children}
    </span>
  );
}

export function ScoreBadge({score,max=5}:{score:number;max?:number}) {
  const pct=(score/max)*100;
  const color=pct>=80?"good":pct>=60?"cyan":pct>=40?"warn":"danger";
  return <Badge color={color}>{score.toFixed(1)} / {max}</Badge>;
}

export function MeritScore({score}:{score:number}) {
  const color=score>=80?"good":score>=60?"cyan":score>=40?"warn":"danger";
  return (
    <span className="inline-flex flex-col items-center gap-0.5">
      <Badge color={color} size="md">{score} / 100</Badge>
      <span className="font-mono text-[9px] tracking-widest uppercase" style={{color:COLOR_MAP[color].text}}>Merit Score</span>
    </span>
  );
}
