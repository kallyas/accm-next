import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { getR2Url, uploadToR2 } from "@/lib/cloudflare-r2";
import { analyzeDocument } from "@/lib/document-analysis";

const personalDiscoverySchema = z.object({
  strengths: z.string(),
  weaknesses: z.string(),
  opportunities: z.string(),
  threats: z.string(),
  achievements: z.string(),
  familyAspirations: z.string(),
  careerAspirations: z.string(),
  financialBusinessAspirations: z.string(),
  socialAspirations: z.string(),
  desiredPosition: z.string(),
  requiredSkills: z.string(),
  coursesAndTrainings: z.string(),
  strategies: z.string(),
  shortTermGoals: z.string(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let analysisResult = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `personal-discovery-${session!.user!.id}-${Date.now()}-${
        file.name
      }`;
      const fileUrl = await uploadToR2(buffer, fileName, file.type);

      const cloudFile = await getR2Url(fileUrl);
      const extension = file.name.split(".").pop()!;
      // Analyze the uploaded document
      analysisResult = await analyzeDocument(cloudFile, extension);
    }

    const personalDiscoveryData = Object.fromEntries(formData.entries());
    const validatedData = personalDiscoverySchema.parse(personalDiscoveryData);

    const personalDiscovery = await db.personalDiscovery.upsert({
      where: { userId: session!.user!.id },
      update: {
        ...validatedData,
        strengths: validatedData.strengths.split(",").map((s) => s.trim()),
        weaknesses: validatedData.weaknesses.split(",").map((s) => s.trim()),
        opportunities: validatedData.opportunities
          .split(",")
          .map((s) => s.trim()),
        threats: validatedData.threats.split(",").map((s) => s.trim()),
        achievements: validatedData.achievements
          .split(",")
          .map((s) => s.trim()),
        familyAspirations: [validatedData.familyAspirations],
        careerAspirations: [validatedData.careerAspirations],
        financialBusinessAspirations: [
          validatedData.financialBusinessAspirations,
        ],
        socialAspirations: [validatedData.socialAspirations],
        desiredPosition: validatedData.desiredPosition
          .split(",")
          .map((s) => s.trim()),
        requiredSkills: validatedData.requiredSkills
          .split(",")
          .map((s) => s.trim()),
        coursesAndTrainings: validatedData.coursesAndTrainings
          .split(",")
          .map((s) => s.trim()),
        strategies: validatedData.strategies.split(",").map((s) => s.trim()),
        shortTermGoals: validatedData.shortTermGoals
          .split(",")
          .map((s) => s.trim()),
        documentAnalysis: analysisResult,
      },
      create: {
        userId: session!.user!.id,
        ...validatedData,
        strengths: validatedData.strengths.split(",").map((s) => s.trim()),
        weaknesses: validatedData.weaknesses.split(",").map((s) => s.trim()),
        opportunities: validatedData.opportunities
          .split(",")
          .map((s) => s.trim()),
        threats: validatedData.threats.split(",").map((s) => s.trim()),
        achievements: validatedData.achievements
          .split(",")
          .map((s) => s.trim()),
        familyAspirations: [validatedData.familyAspirations],
        careerAspirations: [validatedData.careerAspirations],
        financialBusinessAspirations: [
          validatedData.financialBusinessAspirations,
        ],
        socialAspirations: [validatedData.socialAspirations],
        desiredPosition: validatedData.desiredPosition
          .split(",")
          .map((s) => s.trim()),
        requiredSkills: validatedData.requiredSkills
          .split(",")
          .map((s) => s.trim()),
        coursesAndTrainings: validatedData.coursesAndTrainings
          .split(",")
          .map((s) => s.trim()),
        strategies: validatedData.strategies.split(",").map((s) => s.trim()),
        shortTermGoals: validatedData.shortTermGoals
          .split(",")
          .map((s) => s.trim()),
        documentAnalysis: analysisResult,
      },
    });

    await db.user.update({
      where: { id: session!.user!.id },
      data: {
        progressStatus: "CV_ALIGNMENT_PENDING",
      },
    });

    return NextResponse.json(personalDiscovery);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
