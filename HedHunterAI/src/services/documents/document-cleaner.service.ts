export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ");
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function removeNullBytes(text: string): string {
  return text.replace(/\0/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

export function sanitizeExtractedText(text: string): string {
  return normalizeWhitespace(removeNullBytes(stripHtml(text)));
}

export function validateDocumentSize(sizeBytes: number, maxMB: number): boolean {
  return sizeBytes <= maxMB * 1024 * 1024;
}
