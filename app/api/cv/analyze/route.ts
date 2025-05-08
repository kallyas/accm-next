import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getR2Url } from "@/lib/cloudflare-r2";
import { db } from "@/lib/db";
import { ZodError, z } from "zod";
import pdf from "@bingsjs/pdf-parse";
import mammoth from "mammoth";
import { LRUCache } from "lru-cache";
import { analyzeCVContent, CVAnalysisResult, INDUSTRY_KEYWORDS } from "@/lib/utils";

// Define the schema for validating input
const analyzeSchema = z.object({
  cvId: z.string(),
  industry: z.enum(["tech", "finance", "marketing", "general"]).optional(),
});

// Analysis result cache
const analysisCache = new LRUCache<string, CVAnalysisResult>({
  max: 100, // Maximum 100 items
  ttl: 1000 * 60 * 60, // 1 hour TTL
  ttlAutopurge: true, // Auto purge expired items
});

// Text extraction retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Define type guard for error handling
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Extracts text from PDF with retry logic
 */
export async function extractPdfContent(url: string): Promise<string> {
  let attempts = 0;
  let lastError: Error | null = null;
  
  while (attempts < MAX_RETRIES) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfText = await pdf(buffer);
      
      return pdfText.text;
    } catch (error) {
      lastError = isError(error) ? error : new Error(String(error));
      attempts++;
      
      // Wait before retrying
      if (attempts < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      }
    }
  }
  
  throw lastError || new Error("Failed to extract PDF content after multiple attempts");
}

/**
 * Extracts text from DOCX with retry logic
 */
export async function extractDocxContent(url: string): Promise<string> {
  let attempts = 0;
  let lastError: Error | null = null;
  
  while (attempts < MAX_RETRIES) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch DOCX: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      
      return result.value;
    } catch (error) {
      lastError = isError(error) ? error : new Error(String(error));
      attempts++;
      
      // Wait before retrying
      if (attempts < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      }
    }
  }
  
  throw lastError || new Error("Failed to extract DOCX content after multiple attempts");
}

/**
 * Main POST handler function
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Unauthorized if no session
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cvId, industry = "tech" } = analyzeSchema.parse(body);
    
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
    
    try {
      // Check for CV in database
      const cvRecord = await db.cV.findUnique({
        where: { id: cvId, userId: session.user.id },
      });

      // Handle case where CV is not found
      if (!cvRecord) {
        return NextResponse.json({ error: "CV not found" }, { status: 404 });
      }

      // Check cache first
      const cacheKey = `${cvId}:${industry}`;
      const cachedResult = analysisCache.get(cacheKey);
      
      if (cachedResult) {
        // Return cached result but still update DB in background
        updateDatabase(cvId, cachedResult, session.user.id).catch(console.error);
        return NextResponse.json(cachedResult);
      }

      // Get CV URL and extract content
      const cvUrl = await getR2Url(cvRecord.fileUrl);
      let cvContent: string;

      // Extract content based on file type
      if (cvRecord.fileName.toLowerCase().endsWith(".pdf")) {
        cvContent = await extractPdfContent(cvUrl);
      } else if (
        cvRecord.fileName.toLowerCase().endsWith(".docx") || 
        cvRecord.fileName.toLowerCase().endsWith(".doc")
      ) {
        cvContent = await extractDocxContent(cvUrl);
      } else {
        return NextResponse.json(
          { error: "Unsupported file type" },
          { status: 400 }
        );
      }

      // Validate extracted content
      if (!cvContent || cvContent.trim().length < 50) {
        return NextResponse.json(
          { error: "Insufficient content extracted from CV" },
          { status: 422 }
        );
      }

      // Analyze the CV content
      const analysisResult = analyzeCVContent(cvContent, industry as keyof typeof INDUSTRY_KEYWORDS);
      
      // Cache the result
      analysisCache.set(cacheKey, analysisResult);

      // Update database
      await updateDatabase(cvId, analysisResult, session.user.id);

      return NextResponse.json(analysisResult);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    // Handle validation errors from Zod
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: "Validation error", 
        details: error.errors 
      }, { status: 400 });
    }

    // Handle AbortError (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timeout - CV analysis took too long" },
        { status: 408 }
      );
    }

    // Log detailed error for debugging
    console.error("CV Analysis error:", error);

    // Handle other errors with friendly message for users
    return NextResponse.json(
      { error: "Failed to analyze CV", details: isError(error) ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Update database with analysis result and create notification
 */
async function updateDatabase(cvId: string, analysisResult: CVAnalysisResult, userId: string) {
  try {
    // Update CV with analysis result
    const updatedCV = await db.cV.update({
      where: { id: cvId },
      data: {
        analysisResult: JSON.stringify(analysisResult),
      },
    });

    // Create notification for user
    await db.notification.create({
      data: {
        content: `Your CV has been analyzed with a score of ${analysisResult.overallScore}/100`,
        title: `CV Analysis Complete`,
        user: { connect: { id: userId } },
      },
    });

    // Update user progress status
    await db.user.update({
      where: { id: userId },
      data: {
        progressStatus: "SCHOLARSHIP_MATRIX_PENDING",
      },
    });

    return updatedCV;
  } catch (error) {
    console.error("Database update error:", error);
    throw error;
  }
}