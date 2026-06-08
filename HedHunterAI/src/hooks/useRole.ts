"use client";
import { useCurrentUser } from "./useCurrentUser";
import type { UserRole } from "@/types/user";

export function useRole() {
  const { dbUser, loading } = useCurrentUser();
  return {
    role:        dbUser?.role as UserRole | undefined,
    loading,
    isJobSeeker: dbUser?.role === "JOB_SEEKER",
    isCompany:   dbUser?.role === "COMPANY",
    isAdmin:     dbUser?.role === "ADMIN",
  };
}
