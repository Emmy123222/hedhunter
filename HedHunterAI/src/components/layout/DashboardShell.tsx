"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import Image from "next/image";
import type { UserRole } from "@/types/user";

interface DashboardShellProps {
  children:      React.ReactNode;
  role:          UserRole;
  title?:        string;
  subtitle?:     string;
  action?:       React.ReactNode;
  headerAction?: React.ReactNode;
}

export function DashboardShell({children,role,title,subtitle,action,headerAction}:DashboardShellProps) {
  const actionNode = action ?? headerAction;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{background:"#ffffff"}}>
      <Navbar/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={role} mobileOpen={sidebarOpen} onMobileClose={()=>setSidebarOpen(false)}/>
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 min-w-0">
          <div className="flex justify-center pt-4 pb-1 px-4">
            <Image
              src="/HedHunhterAi 1.png"
              alt="HedHunter AI"
              width={220}
              height={220}
              style={{ width: "100%", maxWidth: 180, height: "auto", objectFit: "contain" }}
            />
          </div>
          {(title||actionNode)&&(
            <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 gap-3" style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile hamburger */}
                <button className="lg:hidden flex-none p-2 -ml-1 rounded-lg hover:bg-black/[.04]" style={{color:"#64748b"}} onClick={()=>setSidebarOpen(true)}>
                  <Menu size={20}/>
                </button>
                <div className="min-w-0">
                  {title&&<h1 className="truncate" style={{fontFamily:"Instrument Serif,serif",fontSize:"clamp(22px,3vw,38px)",fontWeight:400,letterSpacing:"-.015em",color:"#0f172a"}}>{title}</h1>}
                  {subtitle&&<p className="mt-0.5 text-sm truncate" style={{color:"#64748b"}}>{subtitle}</p>}
                </div>
              </div>
              {actionNode&&<div className="flex-none">{actionNode}</div>}
            </div>
          )}
          {/* Mobile hamburger when no title bar */}
          {!title&&!actionNode&&(
            <div className="lg:hidden px-4 pt-3">
              <button className="p-2 rounded-lg hover:bg-black/[.04]" style={{color:"#64748b"}} onClick={()=>setSidebarOpen(true)}>
                <Menu size={20}/>
              </button>
            </div>
          )}
          <div className="p-4 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
