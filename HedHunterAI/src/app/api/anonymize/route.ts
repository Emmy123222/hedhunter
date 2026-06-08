import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { parsePdfBuffer } from "@/services/documents/parse-pdf.service";
import { parseDocxBuffer } from "@/services/documents/parse-docx.service";
import { anonymizeDocument } from "@/services/ai/anonymizer.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { documentId, type } = await req.json();

    const docRef  = type === "resume"
      ? adminCol.resumeDocuments(documentId)
      : adminCol.coverLetterDocuments(documentId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Document not found" }, { status: 404 });

    const doc         = docSnap.data()!;
    const originalUrl = doc.originalUrl as string;
    if (!originalUrl) return NextResponse.json({ error: "No original URL" }, { status: 400 });

    // Fetch the file — Cloudinary public URL works directly
    const fetchRes = await fetch(originalUrl);
    if (!fetchRes.ok) {
      return NextResponse.json({ error: `Could not fetch file: ${fetchRes.status} ${fetchRes.statusText}` }, { status: 500 });
    }
    const buf = Buffer.from(await fetchRes.arrayBuffer());

    // Use stored filename to detect type; fall back to URL inspection
    const filename  = (doc.originalFilename as string | undefined) ?? originalUrl;
    const isDocx    = filename.toLowerCase().endsWith(".docx");
    const rawText   = isDocx ? await parseDocxBuffer(buf) : await parsePdfBuffer(buf);

    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json({ error: "Could not extract text from document. Make sure it is not a scanned image." }, { status: 422 });
    }

    const result = await anonymizeDocument(rawText, documentId, type);

    await docRef.update({
      anonymizedText:    result.anonymizedText,
      anonymizationDone: true,
      confidenceScore:   result.confidenceScore,
      ...(type === "resume" && { flaggedForReview: result.requiresReview }),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[anonymize]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
