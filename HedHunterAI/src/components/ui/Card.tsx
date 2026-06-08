"use client";
import { clsx } from "clsx";

interface CardProps {
  children:React.ReactNode; className?:string; padded?:boolean;
  glowTop?:boolean; bordered?:boolean; hover?:boolean;
  as?:"div"|"article"|"section";
}

export function Card({children,className,padded=true,glowTop=false,bordered=true,hover=false,as:Tag="div"}:CardProps) {
  return (
    <Tag className={clsx(
      "relative overflow-hidden rounded-[17px] bg-white",
      bordered&&"border border-black/[.08]",
      padded&&"p-6",
      hover&&"transition-transform duration-250 hover:-translate-y-0.5 hover:border-black/[.14]",
      className
    )} style={{boxShadow:"0 2px 16px -4px rgba(0,0,0,.08), 0 1px 4px -2px rgba(0,0,0,.05)"}}>
      {glowTop&&<span className="absolute left-0 right-0 top-0 h-px"
        style={{background:"linear-gradient(90deg,transparent,rgba(60,232,255,.7),transparent)"}}/>}
      {children}
    </Tag>
  );
}

export function CardHeader({children,className}:{children:React.ReactNode;className?:string}) {
  return <div className={clsx("flex items-center justify-between px-6 py-4 border-b border-black/[.07] bg-black/[.015]",className)}>{children}</div>;
}

export function CardBody({children,className}:{children:React.ReactNode;className?:string}) {
  return <div className={clsx("p-6",className)}>{children}</div>;
}

export function CardFooter({children,className}:{children:React.ReactNode;className?:string}) {
  return <div className={clsx("flex items-center justify-between px-6 py-3 border-t border-black/[.07] bg-black/[.015] flex-wrap gap-2",className)}>{children}</div>;
}
