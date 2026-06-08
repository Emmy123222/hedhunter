import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { uploadFile, buildDocumentKey } from "@/lib/storage";
import { createAuditLog } from "@/lib/audit-log";
import { LIMITS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.role !== "JOB_SEEKER") return NextResponse.json({ error: "Job seeker only" }, { status: 403 });

    const profileSnap = await adminCol.jobSeekerProfiles(session.uid).get();
    if (!profileSnap.exists) return NextResponse.json({ error: "Job seeker profile required" }, { status: 403 });

    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const type     = formData.get("type") as string;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024)
      return NextResponse.json({ error: `File too large (max ${LIMITS.MAX_FILE_SIZE_MB}MB)` }, { status: 400 });

    const ext = file.name.endsWith(".docx") ? ".docx" : ".pdf";
    if (!LIMITS.ALLOWED_FILE_TYPES.includes(ext))
      return NextResponse.json({ error: "Only PDF and DOCX are allowed" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const key = buildDocumentKey(session.uid, type as any, file.name);
    const url = await uploadFile({ key, body: buf, contentType: file.type });

    let docId: string;
    if (type === "resume") {
      const ref = await adminCol.resumeDocumentsCol().add({
        jobSeekerId: session.uid, originalUrl: url, originalFilename: file.name,
        anonymizationDone: false, flaggedForReview: false,
        createdAt: FieldValue.serverTimestamp(),
      });
      docId = ref.id;
    } else if (type === "cover-letter") {
      const ref = await adminCol.coverLetterDocumentsCol().add({
        jobSeekerId: session.uid, originalUrl: url, originalFilename: file.name,
        anonymizationDone: false,
        createdAt: FieldValue.serverTimestamp(),
      });
      docId = ref.id;
    } else {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    await createAuditLog({ actorId: session.uid, actorType: "USER", action: "RESUME_UPLOADED", targetId: docId, targetType: type });
    return NextResponse.json({ url, id: docId });
  } catch (err: any) {
    console.error("[upload]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
