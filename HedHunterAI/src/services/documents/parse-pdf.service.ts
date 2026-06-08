import pdfParse from "pdf-parse";

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

export async function getPdfMetadata(buffer: Buffer): Promise<{
  pages: number; text: string; info: Record<string, unknown>;
}> {
  const data = await pdfParse(buffer);
  return { pages: data.numpages, text: data.text, info: data.info as Record<string, unknown> };
}
