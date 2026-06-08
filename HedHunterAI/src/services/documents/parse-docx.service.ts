import mammoth from "mammoth";

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function parseDocxWithStyle(buffer: Buffer): Promise<{ text: string; html: string }> {
  const [rawResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ buffer }),
    mammoth.convertToHtml({ buffer }),
  ]);
  return { text: rawResult.value, html: htmlResult.value };
}
