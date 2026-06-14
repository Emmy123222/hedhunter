import { NextRequest, NextResponse } from "next/server";
import { adminCol } from "@/lib/db-admin";
import { adminAuth } from "@/lib/firebase-admin";
import { getSessionFromCookies, SESSION_COOKIE } from "@/lib/auth";

async function deleteSubcollection(colRef: FirebaseFirestore.CollectionReference) {
  const snap = await colRef.get();
  const deletes = snap.docs.map(d => d.ref.delete());
  await Promise.all(deletes);
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { uid, role } = session;

    if (role === "COMPANY") {
      // Delete all job posts + their subcollections
      const jobsSnap = await adminCol.jobPostsCol().where("companyId", "==", uid).get();
      for (const jobDoc of jobsSnap.docs) {
        await deleteSubcollection(adminCol.jobQuestions(jobDoc.id));
        await jobDoc.ref.delete();
      }
      // Delete applications made to this company's jobs
      const appsSnap = await adminCol.applicationsCol().where("companyId", "==", uid).get();
      for (const appDoc of appsSnap.docs) {
        await deleteSubcollection(adminCol.appAnswers(appDoc.id));
        await deleteSubcollection(adminCol.appScores(appDoc.id));
        await appDoc.ref.delete();
      }
      // Delete company profile, stripe customer, payments, user doc
      await Promise.all([
        adminCol.companyProfiles(uid).delete(),
        adminCol.stripeCustomers(uid).delete(),
      ]);
      const paymentsSnap = await adminCol.paymentsCol().where("userId", "==", uid).get();
      await Promise.all(paymentsSnap.docs.map(d => d.ref.delete()));

    } else if (role === "JOB_SEEKER") {
      // Delete all applications by this job seeker
      const appsSnap = await adminCol.applicationsCol().where("jobSeekerId", "==", uid).get();
      for (const appDoc of appsSnap.docs) {
        await deleteSubcollection(adminCol.appAnswers(appDoc.id));
        await deleteSubcollection(adminCol.appScores(appDoc.id));
        await appDoc.ref.delete();
      }
      // Delete resume, cover letters, offers, stripe, payments, profile
      const [resumeSnap, coverSnap, offersSnap, paymentsSnap] = await Promise.all([
        adminCol.resumeDocumentsCol().where("userId", "==", uid).get(),
        adminCol.coverLetterDocumentsCol().where("userId", "==", uid).get(),
        adminCol.offersCol().where("jobSeekerId", "==", uid).get(),
        adminCol.paymentsCol().where("userId", "==", uid).get(),
      ]);
      await Promise.all([
        ...resumeSnap.docs.map(d => d.ref.delete()),
        ...coverSnap.docs.map(d => d.ref.delete()),
        ...offersSnap.docs.map(d => d.ref.delete()),
        ...paymentsSnap.docs.map(d => d.ref.delete()),
        adminCol.jobSeekerProfiles(uid).delete(),
        adminCol.stripeCustomers(uid).delete(),
      ]);
    }

    // Delete user doc and Firebase Auth account
    await adminCol.users(uid).delete();
    try { await adminAuth.deleteUser(uid); } catch {}

    const res = NextResponse.json({ ok: true });
    res.cookies.delete(SESSION_COOKIE);
    return res;
  } catch (err: any) {
    console.error("[account DELETE]", err);
    return NextResponse.json({ error: err.message ?? "Delete failed" }, { status: 500 });
  }
}
