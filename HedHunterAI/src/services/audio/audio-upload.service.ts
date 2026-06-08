import { uploadFile } from "@/lib/storage";

const ALLOWED_TYPES = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav", "audio/mpeg"];

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Unsupported type: ${file.type}. Use webm, mp4, ogg, or wav.` };
  }
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: "File too large (max 50MB)" };
  }
  return { valid: true };
}

export async function uploadAudioToS3(buffer: Buffer, applicationId: string, questionId: string): Promise<string> {
  const key = getAudioKey(applicationId, questionId);
  return uploadFile({ body: buffer, key, contentType: "audio/webm" });
}

export function getAudioKey(applicationId: string, questionId: string): string {
  return `audio/${applicationId}/${questionId}.webm`;
}
