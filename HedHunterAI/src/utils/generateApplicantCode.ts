export function generateApplicantCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `APP-${num}`;
}
export function generateAnonymousCode(jobPostId: string): string {
  const hash = jobPostId.slice(-4).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ANON-${hash}-${rand}`;
}
