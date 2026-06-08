import { adminCol } from "@/lib/db-admin";

export async function rankCandidatesForJob(jobPostId: string) {
  const snap = await adminCol.applicationsCol()
    .where("jobPostId", "==", jobPostId)
    .where("status", "in", ["SUBMITTED", "REVIEWING", "SHORTLISTED", "OFFER_SENT"])
    .orderBy("totalScore", "desc").get();

  return snap.docs.map((d, i) => {
    const a = d.data();
    return {
      id: d.id, rank: i + 1,
      anonymousCode: a.anonymousCode, status: a.status,
      totalScore: a.totalScore, aiConfidence: a.aiConfidence,
      requiresHumanReview: a.requiresHumanReview,
      accommodationRequested: a.accommodationRequested,
      createdAt: a.createdAt,
    };
  });
}

export const getJobLeaderboard = rankCandidatesForJob;
