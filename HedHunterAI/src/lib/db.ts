// Firestore helpers — replaces Prisma. All collections use Firebase Auth UID where applicable.
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter, serverTimestamp,
  DocumentData, QueryConstraint, Timestamp,
} from "firebase/firestore";
import { firebaseDb } from "./firebase";

export { serverTimestamp, Timestamp };

// ─── typed collection refs ───────────────────────────────────────────────────
export const col = {
  users:               () => collection(firebaseDb, "users"),
  jobSeekerProfiles:   () => collection(firebaseDb, "jobSeekerProfiles"),
  companyProfiles:     () => collection(firebaseDb, "companyProfiles"),
  jobPosts:            () => collection(firebaseDb, "jobPosts"),
  jobQuestions:        (jobId: string) => collection(firebaseDb, "jobPosts", jobId, "questions"),
  applications:        () => collection(firebaseDb, "applications"),
  appAnswers:          (appId: string) => collection(firebaseDb, "applications", appId, "answers"),
  appScores:           (appId: string) => collection(firebaseDb, "applications", appId, "scores"),
  appAnonymizations:   (appId: string) => collection(firebaseDb, "applications", appId, "anonymizations"),
  resumeDocuments:     () => collection(firebaseDb, "resumeDocuments"),
  coverLetterDocuments:() => collection(firebaseDb, "coverLetterDocuments"),
  offers:              () => collection(firebaseDb, "offers"),
  companyRatings:      () => collection(firebaseDb, "companyRatings"),
  payments:            () => collection(firebaseDb, "payments"),
  stripeCustomers:     () => collection(firebaseDb, "stripeCustomers"),
  auditLogs:           () => collection(firebaseDb, "auditLogs"),
  complianceFlags:     () => collection(firebaseDb, "complianceFlags"),
  appeals:             () => collection(firebaseDb, "appeals"),
};

export { query, where, orderBy, limit, startAfter, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc };
export type { DocumentData, QueryConstraint };
