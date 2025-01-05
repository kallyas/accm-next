import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getR2Url } from "@/lib/cloudflare-r2";
import { analyzeCVContent } from "@/lib/utils";
import { db } from "@/lib/db";
import { z } from "zod";
import pdf from "@bingsjs/pdf-parse";
import mammoth from "mammoth";
import fs from "fs";

// Define the schema for validating input
const analyzeSchema = z.object({
  cvId: z.string(),
});

export async function extractPdfContent(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const pdfText = await pdf(buffer);
  return pdfText.text;
}

// Helper function to handle DOCX extraction
export async function extractDocxContent(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Main POST handler function
export async function POST(req: Request) {
  
  const session = await getServerSession(authOptions);

  // Unauthorized if no session
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cvId } = analyzeSchema.parse(await req.json());
    const cvRecord = await db.cV.findUnique({
      where: { id: cvId, userId: session!.user!.id },
    });

    // Handle case where CV is not found
    if (!cvRecord) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

 
    const cvUrl = await getR2Url(cvRecord.fileUrl);
    let cvContent: string;

    // Determine the file type and extract content accordingly
    if (cvRecord.fileName.endsWith(".pdf")) {
      cvContent = await extractPdfContent(cvUrl);
    } else if (cvRecord.fileName.endsWith(".docx")) {
      cvContent = await extractDocxContent(cvUrl);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Analyze the CV content
    const analysisResult = analyzeCVContent(cvContent);

    // Save analysis result in the database
    const updatedCV = await db.cV.update({
      where: { id: cvId },
      data: {
        analysisResult: JSON.stringify(analysisResult),
      },
    });

    await db.notification.create({
      data: {
        content: `Your CV ${cvRecord.fileName} has been analyzed`,
        title: `CV Analysis Complete for ${cvRecord.fileName}`,
        user: { connect: { id: session!.user!.id } },
      },
    });

    return NextResponse.json(updatedCV);
  } catch (error) {
    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Internal Server Error" + (error as Error).message },
      { status: 500 }
    );
  }
}
