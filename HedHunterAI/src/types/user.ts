export type UserRole = "JOB_SEEKER" | "COMPANY" | "ADMIN";

export interface User {
  uid:       string;
  email:     string;
  role:      UserRole;
  createdAt: any;
  updatedAt: any;
}

export interface JobSeekerProfile {
  uid:              string;
  applicantCode:    string;
  registrationPaid: boolean;
  createdAt:        any;
  updatedAt:        any;
}

export interface UserWithProfile extends User {
  jobSeekerProfile?: JobSeekerProfile | null;
  companyProfile?:   CompanyProfile   | null;
}

import type { CompanyProfile } from "./company";
