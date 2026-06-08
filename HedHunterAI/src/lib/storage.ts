import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export async function uploadFile(params: {
  key:         string;
  body:        Buffer;
  contentType: string;
}): Promise<string> {
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id:     params.key.replace(/\//g, "__").replace(/\.[^.]+$/, ""),
        resource_type: "raw",      // PDFs, DOCX, audio
        folder:        "hed-hunter",
        access_mode:   "public",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(params.body);
  });

  return result.secure_url as string;
}

export async function getDownloadUrl(publicIdOrUrl: string): Promise<string> {
  // Generate a signed URL valid for 1 hour
  const publicId = publicIdOrUrl.includes("cloudinary.com")
    ? extractPublicId(publicIdOrUrl)
    : publicIdOrUrl;

  return cloudinary.utils.private_download_url(publicId, "auto", {
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    resource_type: "raw",
  });
}

function extractPublicId(url: string): string {
  // Extract public_id from a Cloudinary URL
  const match = url.match(/\/hed-hunter\/(.+?)(?:\.[^.\/]+)?$/);
  return match ? `hed-hunter/${match[1]}` : url;
}

export function buildDocumentKey(uid: string, type: "resume" | "cover-letter" | "audio", filename: string): string {
  return `${type}s/${uid}/${Date.now()}-${filename}`;
}

export function buildAnonymizedKey(originalKey: string): string {
  return originalKey.replace(/^(resumes|cover-letters)\//, "anonymized/$1/");
}
