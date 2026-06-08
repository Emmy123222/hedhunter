// Firestore Admin helpers for server-side / API routes
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";

export { FieldValue, Timestamp };

export const adminCol = {
  users:                (uid: string)   => adminDb.collection("users").doc(uid),
  usersCol:             ()              => adminDb.collection("users"),
  jobSeekerProfiles:    (uid: string)   => adminDb.collection("jobSeekerProfiles").doc(uid),
  jobSeekerProfilesCol: ()              => adminDb.collection("jobSeekerProfiles"),
  companyProfiles:      (uid: string)   => adminDb.collection("companyProfiles").doc(uid),
  companyProfilesCol:   ()              => adminDb.collection("companyProfiles"),
  jobPosts:             (id: string)    => adminDb.collection("jobPosts").doc(id),
  jobPostsCol:          ()              => adminDb.collection("jobPosts"),
  jobQuestions:         (jobId: string) => adminDb.collection("jobPosts").doc(jobId).collection("questions"),
  jobQuestion:          (jobId: string, qId: string) => adminDb.collection("jobPosts").doc(jobId).collection("questions").doc(qId),
  applications:         (id: string)   => adminDb.collection("applications").doc(id),
  applicationsCol:      ()             => adminDb.collection("applications"),
  appAnswers:           (appId: string) => adminDb.collection("applications").doc(appId).collection("answers"),
  appAnswer:            (appId: string, aId: string) => adminDb.collection("applications").doc(appId).collection("answers").doc(aId),
  appScores:            (appId: string) => adminDb.collection("applications").doc(appId).collection("scores"),
  appScore:             (appId: string, sId: string) => adminDb.collection("applications").doc(appId).collection("scores").doc(sId),
  resumeDocuments:      (id: string)   => adminDb.collection("resumeDocuments").doc(id),
  resumeDocumentsCol:   ()             => adminDb.collection("resumeDocuments"),
  coverLetterDocuments: (id: string)   => adminDb.collection("coverLetterDocuments").doc(id),
  coverLetterDocumentsCol:()           => adminDb.collection("coverLetterDocuments"),
  offers:               (id: string)   => adminDb.collection("offers").doc(id),
  offersCol:            ()             => adminDb.collection("offers"),
  companyRatings:       (id: string)   => adminDb.collection("companyRatings").doc(id),
  companyRatingsCol:    ()             => adminDb.collection("companyRatings"),
  payments:             (id: string)   => adminDb.collection("payments").doc(id),
  paymentsCol:          ()             => adminDb.collection("payments"),
  stripeCustomers:      (uid: string)  => adminDb.collection("stripeCustomers").doc(uid),
  auditLogs:            ()             => adminDb.collection("auditLogs"),
  complianceFlags:      (id: string)   => adminDb.collection("complianceFlags").doc(id),
  complianceFlagsCol:   ()             => adminDb.collection("complianceFlags"),
  appeals:              (id: string)   => adminDb.collection("appeals").doc(id),
  appealsCol:           ()             => adminDb.collection("appeals"),
};

// Safe query — returns empty snapshot instead of throwing on missing index or empty collection
export async function safeGet(query: FirebaseFirestore.Query | FirebaseFirestore.CollectionReference): Promise<FirebaseFirestore.QuerySnapshot> {
  try {
    return await query.get();
  } catch (e: any) {
    if (e.code === 9 || e.message?.includes("index") || e.message?.includes("NOT_FOUND")) {
      // Return a fake empty snapshot
      return { docs: [], empty: true, size: 0, forEach: () => {} } as any;
    }
    throw e;
  }
}
