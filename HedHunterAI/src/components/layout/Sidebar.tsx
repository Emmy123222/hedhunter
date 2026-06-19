"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";
import { LayoutDashboard,Briefcase,FileText,Gift,Star,Users,Building2,Settings,DollarSign,ShieldAlert,Flag,ScrollText,Search,Trash2,X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import type { UserRole } from "@/types/user";

type NavItem = { href:string; label:string; icon:React.ReactNode; count?:number };

const JS_NAV: NavItem[] = [
  {href:"/job-seeker/dashboard",     label:"Dashboard",      icon:<LayoutDashboard size={16}/>},
  {href:"/job-seeker/jobs",          label:"Browse Jobs",    icon:<Search size={16}/>},
  {href:"/job-seeker/applications",  label:"Applications",   icon:<FileText size={16}/>},
  {href:"/job-seeker/resume-upload", label:"Resume",         icon:<Briefcase size={16}/>},
  {href:"/job-seeker/offers",        label:"Offers",         icon:<Gift size={16}/>},
];

const CO_NAV: NavItem[] = [
  {href:"/company/dashboard",     label:"Dashboard",     icon:<LayoutDashboard size={16}/>},
  {href:"/company/jobs",          label:"Job Posts",     icon:<Briefcase size={16}/>},
  {href:"/company/jobs/create",   label:"Post a Job",    icon:<FileText size={16}/>},
  {href:"/company/profile",       label:"Profile",       icon:<Building2 size={16}/>},
  {href:"/company/ratings",       label:"Ratings",       icon:<Star size={16}/>},
];

const AD_NAV: NavItem[] = [
  {href:"/admin/dashboard",              label:"Dashboard",      icon:<LayoutDashboard size={16}/>},
  {href:"/admin/users",                  label:"Users",          icon:<Users size={16}/>},
  {href:"/admin/companies",              label:"Companies",      icon:<Building2 size={16}/>},
  {href:"/admin/jobs",                   label:"Jobs",           icon:<Briefcase size={16}/>},
  {href:"/admin/payments",               label:"Payments",       icon:<DollarSign size={16}/>},
  {href:"/admin/anonymization-review",   label:"Anon Review",    icon:<ShieldAlert size={16}/>},
  {href:"/admin/flagged-questions",      label:"Flagged Qs",     icon:<Flag size={16}/>},
  {href:"/admin/appeals",                label:"Appeals",        icon:<Settings size={16}/>},
  {href:"/admin/audit-logs",             label:"Audit Logs",     icon:<ScrollText size={16}/>},
  {href:"/admin/settings",               label:"Settings",       icon:<Settings size={16}/>},
];

interface SidebarProps {
  role: UserRole;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ role, mobileOpen = false, onMobileClose }: SidebarProps) {
  const path   = usePathname();
  const router = useRouter();
  const nav    = role==="ADMIN"?AD_NAV:role==="COMPANY"?CO_NAV:JS_NAV;

  const [confirm,  setConfirm]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [delError, setDelError] = useState<string|null>(null);

  async function handleDelete() {
    setDeleting(true); setDelError(null);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      router.push("/");
    } catch (e: any) {
      setDelError(e.message ?? "Delete failed");
      setDeleting(false);
    }
  }

  const sidebarContent = (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex items-center justify-between mb-4 pb-4" style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
        <Logo height={52} href="/" />
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg hover:bg-black/[.04]" style={{color:"#64748b"}}>
            <X size={18}/>
          </button>
        )}
      </div>
      {nav.map(item=>{
        const active = path===item.href || (item.href!=="/" && path.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href}
            onClick={onMobileClose}
            className={clsx(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              active
                ? "text-[#0f172a] bg-gradient-to-r from-[rgba(91,141,239,.14)] to-transparent border-l-2 border-[#3ce8ff] pl-2.5"
                : "text-[#475569] hover:text-[#0f172a] hover:bg-black/[.04]"
            )}>
            <span className={active?"text-[#3ce8ff]":"text-[#64748b]"}>{item.icon}</span>
            {item.label}
            {item.count!==undefined&&(
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded" style={{background:active?"rgba(60,232,255,.14)":"rgba(0,0,0,.04)",color:active?"#3ce8ff":"#64748b"}}>{item.count}</span>
            )}
          </Link>
        );
      })}
      {(role==="COMPANY"||role==="JOB_SEEKER")&&(
        <button
          onClick={()=>{ setConfirm(true); setDelError(null); onMobileClose?.(); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full transition-all duration-200 hover:bg-red-50"
          style={{color:"#ef4444"}}>
          <Trash2 size={16}/>
          Delete Account
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-none flex-col py-6 px-4" style={{borderRight:"1px solid rgba(0,0,0,.07)",background:"rgba(255,255,255,.01)"}}>
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onMobileClose}/>
          <aside className="relative z-50 w-64 h-full py-6 px-4 overflow-y-auto" style={{background:"#ffffff",borderRight:"1px solid rgba(0,0,0,.07)"}}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirm&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:"rgba(0,0,0,.45)"}}>
          <div className="bg-white rounded-2xl p-7 shadow-2xl w-full max-w-sm">
            <h3 style={{fontFamily:"Instrument Serif,serif",fontSize:22,fontWeight:400,color:"#0f172a",marginBottom:8}}>Delete account?</h3>
            <p className="text-sm mb-6" style={{color:"#64748b"}}>This will permanently delete your account and all associated data. This action cannot be undone.</p>
            {delError&&<p className="text-xs mb-4" style={{color:"#ef4444"}}>{delError}</p>}
            <div className="flex gap-3">
              <button onClick={()=>{setConfirm(false);setDelError(null);}} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium" style={{background:"#f1f5f9",color:"#475569"}}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium" style={{background:"#ef4444",color:"#fff",opacity:deleting?0.6:1}}>
                {deleting?"Deleting…":"Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
