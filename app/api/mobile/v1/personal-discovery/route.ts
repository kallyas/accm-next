import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  validationError,
  parseBody,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const personalDiscovery = await db.personalDiscovery.findUnique({
      where: { userId: authResult.id },
    });

    return successResponse({
      personalDiscovery,
      exists: !!personalDiscovery,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await parseBody(req);

    if (!body) {
      return validationError("Invalid request body");
    }

    // Check if personal discovery already exists
    const existing = await db.personalDiscovery.findUnique({
      where: { userId: authResult.id },
    });

    if (existing) {
      return validationError("Personal discovery already exists. Use PUT to update.");
    }

    const {
      strengths = [],
      weaknesses = [],
      opportunities = [],
      achievements = [],
      threats = [],
      familyAspirations = [],
      careerAspirations = [],
      financialBusinessAspirations = [],
      socialAspirations = [],
      desiredPosition = [],
      requiredSkills = [],
      coursesAndTrainings = [],
      strategies = [],
      shortTermGoals = [],
      documentAnalysis,
    } = body;

    const personalDiscovery = await db.personalDiscovery.create({
      data: {
        userId: authResult.id,
        strengths,
        weaknesses,
        opportunities,
        achievements,
        threats,
        familyAspirations,
        careerAspirations,
        financialBusinessAspirations,
        socialAspirations,
        desiredPosition,
        requiredSkills,
        coursesAndTrainings,
        strategies,
        shortTermGoals,
        documentAnalysis,
      },
    });

    // Update user progress status
    await db.user.update({
      where: { id: authResult.id },
      data: {
        progressStatus: "CV_ALIGNMENT_PENDING",
      },
    });

    return successResponse({
      personalDiscovery,
      message: "Personal discovery created successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await parseBody(req);

    if (!body) {
      return validationError("Invalid request body");
    }

    const {
      strengths,
      weaknesses,
      opportunities,
      achievements,
      threats,
      familyAspirations,
      careerAspirations,
      financialBusinessAspirations,
      socialAspirations,
      desiredPosition,
      requiredSkills,
      coursesAndTrainings,
      strategies,
      shortTermGoals,
      documentAnalysis,
    } = body;

    const personalDiscovery = await db.personalDiscovery.upsert({
      where: { userId: authResult.id },
      create: {
        userId: authResult.id,
        strengths: strengths || [],
        weaknesses: weaknesses || [],
        opportunities: opportunities || [],
        achievements: achievements || [],
        threats: threats || [],
        familyAspirations: familyAspirations || [],
        careerAspirations: careerAspirations || [],
        financialBusinessAspirations: financialBusinessAspirations || [],
        socialAspirations: socialAspirations || [],
        desiredPosition: desiredPosition || [],
        requiredSkills: requiredSkills || [],
        coursesAndTrainings: coursesAndTrainings || [],
        strategies: strategies || [],
        shortTermGoals: shortTermGoals || [],
        documentAnalysis,
      },
      update: {
        ...(strengths !== undefined && { strengths }),
        ...(weaknesses !== undefined && { weaknesses }),
        ...(opportunities !== undefined && { opportunities }),
        ...(achievements !== undefined && { achievements }),
        ...(threats !== undefined && { threats }),
        ...(familyAspirations !== undefined && { familyAspirations }),
        ...(careerAspirations !== undefined && { careerAspirations }),
        ...(financialBusinessAspirations !== undefined && { financialBusinessAspirations }),
        ...(socialAspirations !== undefined && { socialAspirations }),
        ...(desiredPosition !== undefined && { desiredPosition }),
        ...(requiredSkills !== undefined && { requiredSkills }),
        ...(coursesAndTrainings !== undefined && { coursesAndTrainings }),
        ...(strategies !== undefined && { strategies }),
        ...(shortTermGoals !== undefined && { shortTermGoals }),
        ...(documentAnalysis !== undefined && { documentAnalysis }),
      },
    });

    // Update user progress if not already done
    const user = await db.user.findUnique({
      where: { id: authResult.id },
      select: { progressStatus: true },
    });

    if (user?.progressStatus === "PERSONAL_DISCOVERY_PENDING") {
      await db.user.update({
        where: { id: authResult.id },
        data: {
          progressStatus: "CV_ALIGNMENT_PENDING",
        },
      });
    }

    return successResponse({
      personalDiscovery,
      message: "Personal discovery updated successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
