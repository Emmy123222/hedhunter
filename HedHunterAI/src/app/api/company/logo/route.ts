import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { uploadImage } from "@/lib/storage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE_MB   = 2;

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== "COMPANY")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Only JPG, PNG, WebP or SVG allowed" }, { status: 400 });
    if (file.size > MAX_SIZE_MB * 1024 * 1024)
      return NextResponse.json({ error: `File too large (max ${MAX_SIZE_MB}MB)` }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const key = `logos/${session.uid}/${Date.now()}-${file.name}`;
    const url = await uploadImage({ key, body: buf, contentType: file.type });

    await adminCol.companyProfiles(session.uid).set(
      { logoUrl: url, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("[company/logo]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
