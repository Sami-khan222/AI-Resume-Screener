import pdfParse from "pdf-parse";

/**
 * Extracts plain text from a PDF file buffer (multer memory storage gives us a Buffer).
 * Throws a descriptive error if the PDF has no extractable text (e.g. a scanned image).
 */
export async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  const text = (data.text || "").trim();

  if (!text || text.length < 30) {
    throw new Error(
      "Could not read any text from this PDF. It may be a scanned image without selectable text - try exporting the resume as a text-based PDF."
    );
  }

  return text;
}
