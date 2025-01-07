import pdf from "@bingsjs/pdf-parse";
import mammoth from "mammoth";
import axios from "axios";

interface ParseResult {
  content: string;
  metadata: {
    fileType: string;
    wordCount: number;
  };
}

/**
 * Parses PDF and Word documents
 * @param fileUrl - The URL of the file to parse
 * @param fileName - The name of the file including extension
 * @returns ParseResult containing the document content and metadata
 */
export async function parseDocument(
  fileUrl: string,
  fileName: string
): Promise<ParseResult> {
  try {
    // Get file extension
    const extension = fileName.toLowerCase().split(".").pop();

    // Validate supported file types
    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
      throw new Error(
        "Unsupported file type. Only PDF and Word documents are supported."
      );
    }

    // Read file buffer
    const fileBuffer = await axios
      .get(fileUrl, { responseType: "arraybuffer" })
      .then((response) => Buffer.from(response.data));


    // Parse based on file type
    let content: string;
    if (extension === "pdf") {
      const data = await pdf(fileBuffer);
      content = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      content = result.value;
    }

    // Clean up content
    content = content
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace

    // Calculate word count
    const wordCount = content.split(/\s+/).length;

    return {
      content,
      metadata: {
        fileType: extension.toUpperCase(),
        wordCount,
      },
    };
  } catch (error) {
    console.error("Error parsing document:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to parse document: ${error.message}`);
    } else {
      throw new Error("Failed to parse document: Unknown error");
    }
  }
}
