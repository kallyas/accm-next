import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const AssessmentSchema = z.object({
  userId: z.string().optional(),
  answers: z.record(z.string()),
  suggestions: z.array(
    z.object({
      title: z.string(),
      confidence: z.number(),
      description: z.string(),
      skills: z.array(z.string()),
      education: z.array(z.string()),
      matchingFactors: z.array(z.string()),
    })
  ),
  completedAt: z.string().datetime(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received assessment:", body);
    const validated = AssessmentSchema.parse(body);

    // Create or get CareerUser
    let careerUser = null;
    if (validated.userId) {
      careerUser = await db.careerUser.findFirst({
        where: { authUserId: validated.userId },
      });
    }

    if (!careerUser) {
      // Create anonymous user if no authenticated user found
      careerUser = await db.careerUser.create({
        data: {
          name: validated.answers.userName || "Anonymous User",
          age: validated.answers.age || "Not specified",
          gender: validated.answers.gender,
          location: validated.answers.location,
          isAuthenticated: !!validated.userId,
          authUserId: validated.userId,
        },
      });
    }

    // Create the assessment
    const assessment = await db.careerAssessment.create({
      data: {
        careerUserId: careerUser.id,
        status: "COMPLETED",
        completedAt: new Date(validated.completedAt),

        // Educational background
        education: validated.answers.education,
        field: validated.answers.fieldOfStudy,

        // Career preferences
        employment: validated.answers.employment,
        sector: validated.answers.workEnvironment,

        // Personal aspirations
        passion: validated.answers.passion,
        lifePassion: validated.answers.interests,
        lifeGoal: validated.answers.impact,
        futureTitle: validated.answers.fiveYearGoal,
        futureTasks: validated.answers.futureTasks || "",

        // Skills and education
        requiredSkills: validated.answers.keyStrengths,
        requiredCourses: validated.answers.requiredCourses || "",

        // Results
        suggestedCareer: validated.suggestions[0].title,
        confidenceScore: validated.suggestions[0].confidence,
        matchingFactors: validated.suggestions[0].matchingFactors,

        // Generate a unique share code
        shareCode: Math.random().toString(36).substring(2, 15),
      },
    });

    // First, get the current analytics
    const currentAnalytics = await db.careerAnalytics.findUnique({
      where: { careerPath: validated.suggestions[0].title },
    });

    // Calculate new average confidence
    const newTotalSuggestions = (currentAnalytics?.totalSuggestions || 0) + 1;
    const newAverageConfidence = currentAnalytics
      ? (currentAnalytics.averageConfidence *
          currentAnalytics.totalSuggestions +
          validated.suggestions[0].confidence) /
        newTotalSuggestions
      : validated.suggestions[0].confidence;

    // Update analytics with calculated values
    await db.careerAnalytics.upsert({
      where: { careerPath: validated.suggestions[0].title },
      create: {
        careerPath: validated.suggestions[0].title,
        totalSuggestions: 1,
        averageConfidence: validated.suggestions[0].confidence,
        ageRangeDistribution: { [validated.answers.age]: 1 },
        genderDistribution: validated.answers.gender
          ? { [validated.answers.gender]: 1 }
          : {},
        fieldDistribution: { [validated.answers.fieldOfStudy]: 1 },
      },
      update: {
        totalSuggestions: { increment: 1 },
        averageConfidence: newAverageConfidence,
        ageRangeDistribution: currentAnalytics
          ? {
              set: {
                ...(typeof currentAnalytics?.ageRangeDistribution === "object"
                  ? currentAnalytics.ageRangeDistribution
                  : {}),
                [validated.answers.age]:
                  (((currentAnalytics?.ageRangeDistribution as Record<
                    string,
                    number
                  >) || {})[validated.answers.age] || 0) + 1,
              },
            }
          : { set: { [validated.answers.age]: 1 } },
        genderDistribution: validated.answers.gender
          ? {
              set: {
                ...(typeof currentAnalytics?.genderDistribution === "object"
                  ? currentAnalytics.genderDistribution
                  : {}),
                [validated.answers.gender]:
                  (((currentAnalytics?.genderDistribution as Record<
                    string,
                    number
                  >) || {})[validated.answers.gender] || 0) + 1,
              },
            }
          : undefined,
        fieldDistribution: {
          set: {
            ...(typeof currentAnalytics?.fieldDistribution === "object"
              ? currentAnalytics.fieldDistribution
              : {}),
            [validated.answers.fieldOfStudy]:
              (((currentAnalytics?.fieldDistribution as Record<
                string,
                number
              >) || {})[validated.answers.fieldOfStudy] || 0) + 1,
          },
        },
      },
    });

    // Update daily analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await db.analyticsIndex.upsert({
      where: { id: today.toISOString().split("T")[0] },
      create: {
        date: today,
        newAssessments: 1,
        completedAssessments: 1,
      },
      update: {
        newAssessments: { increment: 1 },
        completedAssessments: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      shareCode: assessment.shareCode,
    });
  } catch (error) {
    console.error("Error processing assessment:", error);
    return NextResponse.json(
      { error: "Failed to process assessment" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shareCode = searchParams.get("shareCode");

  if (!shareCode) {
    return NextResponse.json(
      { error: "Share code is required" },
      { status: 400 }
    );
  }

  try {
    const assessment = await db.careerAssessment.findUnique({
      where: { shareCode },
      include: {
        careerUser: {
          select: {
            name: true,
            age: true,
            location: true,
          },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      assessment: {
        suggestedCareer: assessment.suggestedCareer,
        confidence: assessment.confidenceScore,
        matchingFactors: assessment.matchingFactors,
        completedAt: assessment.completedAt,
        user: {
          name: assessment.careerUser.name,
          age: assessment.careerUser.age,
          location: assessment.careerUser.location,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    );
  }
}
