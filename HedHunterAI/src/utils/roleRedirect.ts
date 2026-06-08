import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types/user";

export function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case "JOB_SEEKER": return ROUTES.JS_DASHBOARD;
    case "COMPANY":    return ROUTES.CO_DASHBOARD;
    case "ADMIN":      return ROUTES.AD_DASHBOARD;
    default:           return ROUTES.HOME;
  }
}
export function getRoleOnboarding(role: UserRole): string {
  switch (role) {
    case "JOB_SEEKER": return ROUTES.JS_ONBOARDING;
    case "COMPANY":    return ROUTES.CO_ONBOARDING;
    default:           return ROUTES.HOME;
  }
}
