export function canApplyToJob(profile: { registrationPaid: boolean }): boolean {
  return profile.registrationPaid;
}

export function canCreateJobPost(company: { annualPaid: boolean; status: string }): boolean {
  return company.annualPaid && company.status === "APPROVED";
}

export function canViewCandidateIdentity(
  application: { identityUnsealed: boolean },
  requestingUserId: string,
  authorizedUserId: string,
): boolean {
  return application.identityUnsealed && requestingUserId === authorizedUserId;
}

export function canHireCandidate(company: { status: string; annualPaid: boolean }): boolean {
  return company.status === "APPROVED" && company.annualPaid;
}

export function isAdmin(role: string): boolean {
  return role === "ADMIN";
}

export function requiresHumanReview(confidence: number): boolean {
  return confidence < 0.75;
}

export function canRateCompany(
  applications: Array<{ status: string; jobPost: { companyId: string } }>,
  companyId: string,
): boolean {
  return applications.some(a => a.status === "HIRED" && a.jobPost.companyId === companyId);
}
