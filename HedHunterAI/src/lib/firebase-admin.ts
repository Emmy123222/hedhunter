import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "";
const privateKey  = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "").replace(/\\n/g, "\n").replace(/\\\\n/g, "\n");

const adminApp =
  getApps().find((a) => a.name === "admin") ||
  initializeApp(
    clientEmail && privateKey
      ? { credential: cert({ projectId, clientEmail, privateKey }) }
      : { projectId },
    "admin"
  );

export const adminAuth = getAuth(adminApp);
export const adminDb   = getFirestore(adminApp);
