import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for validating the request body
const scholarshipAssessmentSchema = z.object({
  reasonForDegree: z.string().min(1, "Please provide a reason for pursuing the degree"),
  whyNow: z.string().min(1, "Please explain why you want to pursue the degree now"),
  undergraduateCGPA: z.number().min(0).max(5, "CGPA must be between 0 and 5"),
  undergraduateCourse: z.string().min(1, "Please provide your undergraduate course"),
  workExperienceYears: z.number().int().min(0, "Work experience must be a positive number"),
  leadershipExperience: z.boolean(),
  leadershipDetails: z.string().optional(),
  communityService: z.boolean(),
  awardsAndHonors: z.boolean(),
  publications: z.boolean(),
  hasLinkedIn: z.boolean(),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const json = await req.json();
    const body = scholarshipAssessmentSchema.parse(json);

    // First check if an assessment exists for this user
    const existingAssessment = await db.scholarshipAssessment.findUnique({
      where: { userId: session.user.id },
    });

    let assessment;

    if (existingAssessment) {
      // Update existing assessment
      assessment = await db.scholarshipAssessment.update({
        where: { userId: session.user.id },
        data: body,
      });
    } else {
      // Create new assessment
      assessment = await db.scholarshipAssessment.create({
        data: {
          ...body,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("ScholarshipAssessment Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const assessment = await db.scholarshipAssessment.findUnique({
      where: { userId: session.user.id },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("ScholarshipAssessment Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}