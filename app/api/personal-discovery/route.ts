import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

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
    const json = await req.json();
    const body = personalDiscoverySchema.parse(json);

    const personalDiscovery = await db.personalDiscovery.upsert({
      where: { userId: session!.user!.id },
      update: {
        strengths: body.strengths.split(",").map((s) => s.trim()),
        weaknesses: body.weaknesses.split(",").map((s) => s.trim()),
        opportunities: body.opportunities.split(",").map((s) => s.trim()),
        threats: body.threats.split(",").map((s) => s.trim()),
        achievements: body.achievements.split(",").map((s) => s.trim()),
        familyAspirations: [body.familyAspirations],
        careerAspirations: [body.careerAspirations],
        financialBusinessAspirations: [body.financialBusinessAspirations],
        socialAspirations: [body.socialAspirations],
        desiredPosition: body.desiredPosition.split(",").map((s) => s.trim()),
        requiredSkills: body.requiredSkills.split(",").map((s) => s.trim()),
        coursesAndTrainings: body.coursesAndTrainings
          .split(",")
          .map((s) => s.trim()),
        strategies: body.strategies.split(",").map((s) => s.trim()),
        shortTermGoals: body.shortTermGoals.split(",").map((s) => s.trim()),
      },
      create: {
        userId: session!.user!.id,
        strengths: body.strengths.split(",").map((s) => s.trim()),
        weaknesses: body.weaknesses.split(",").map((s) => s.trim()),
        opportunities: body.opportunities.split(",").map((s) => s.trim()),
        threats: body.threats.split(",").map((s) => s.trim()),
        achievements: body.achievements.split(",").map((s) => s.trim()),
        familyAspirations: [body.familyAspirations],
        careerAspirations: [body.careerAspirations],
        financialBusinessAspirations: [body.financialBusinessAspirations],
        socialAspirations: [body.socialAspirations],
        desiredPosition: body.desiredPosition.split(",").map((s) => s.trim()),
        requiredSkills: body.requiredSkills.split(",").map((s) => s.trim()),
        coursesAndTrainings: body.coursesAndTrainings
          .split(",")
          .map((s) => s.trim()),
        strategies: body.strategies.split(",").map((s) => s.trim()),
        shortTermGoals: body.shortTermGoals.split(",").map((s) => s.trim()),
      },
    });

    return NextResponse.json(personalDiscovery);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" + (error as Error).message },
      { status: 500 }
    );
  }
}
