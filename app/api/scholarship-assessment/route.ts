import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const scholarshipAssessmentSchema = z.object({
  // Education and Field Questions
  educationLevel: z.enum(
    [
      "high_school",
      "certificate",
      "diploma",
      "bachelors",
      "masters",
      "phd",
      "other",
    ],
    {
      required_error: "Please select your education level",
    }
  ),

  fieldPreference: z.enum(["arts", "sciences"], {
    required_error: "Please select arts or sciences",
  }),

  // Demographics
  ageRange: z.enum(
    ["under_18", "18_24", "25_34", "35_44", "45_54", "55_plus"],
    {
      required_error: "Please select your age range",
    }
  ),

  gender: z.enum(
    ["male", "female", "non_binary", "prefer_not_to_say", "other"],
    {
      required_error: "Please select your gender",
    }
  ),

  // Employment Preferences
  employmentPreference: z.enum(["self_employed", "government", "private"], {
    required_error: "Please select your preferred employment type",
  }),

  selfEmploymentType: z.enum(["profit", "non_profit"]).optional().nullable(),

  careerSector: z.enum(["academia", "policy", "industry"], {
    required_error: "Please select your preferred career sector",
  }),

  // Personal Aspirations
  unpaidPassion: z
    .string()
    .min(
      1,
      "Please describe what you love doing without financial compensation"
    )
    .max(1000, "Response too long - please be more concise"),

  personalPassion: z
    .string()
    .min(1, "Please describe what you are passionate about")
    .max(1000, "Response too long - please be more concise"),

  lifeGoal: z
    .string()
    .min(1, "Please describe the problem you want to solve")
    .max(1000, "Response too long - please be more concise"),

  futureTitle: z
    .string()
    .min(1, "Please specify your desired future title")
    .max(100, "Title too long - please be more concise"),

  futureTasks: z
    .string()
    .min(1, "Please describe your future tasks")
    .max(1000, "Response too long - please be more concise"),

  requiredSkills: z
    .string()
    .min(1, "Please list the required skills")
    .max(1000, "Response too long - please be more concise"),

  desiredCourses: z
    .string()
    .min(1, "Please specify the courses you need")
    .max(1000, "Response too long - please be more concise"),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
