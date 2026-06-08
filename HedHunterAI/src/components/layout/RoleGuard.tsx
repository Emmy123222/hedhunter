"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import type { UserRole } from "@/types/user";

interface RoleGuardProps {
  role: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const { role: userRole } = useRole();

  if (loading) return null;
  if (!user || userRole !== role) return <>{fallback}</>;
  return <>{children}</>;
}
