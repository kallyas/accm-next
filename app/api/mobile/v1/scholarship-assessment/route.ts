import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  validationError,
  parseBody,
  validateRequiredFields,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const scholarshipAssessment = await db.scholarshipAssessment.findUnique({
      where: { userId: authResult.id },
    });

    return successResponse({
      scholarshipAssessment,
      exists: !!scholarshipAssessment,
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

    const requiredFields = [
      "educationLevel",
      "fieldPreference",
      "ageRange",
      "gender",
      "employmentPreference",
      "careerSector",
      "unpaidPassion",
      "personalPassion",
      "lifeGoal",
      "futureTitle",
      "futureTasks",
      "requiredSkills",
      "desiredCourses",
    ];

    const validation = validateRequiredFields(body, requiredFields);
    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    // Check if assessment already exists
    const existing = await db.scholarshipAssessment.findUnique({
      where: { userId: authResult.id },
    });

    if (existing) {
      return validationError("Scholarship assessment already exists. Use PUT to update.");
    }

    const scholarshipAssessment = await db.scholarshipAssessment.create({
      data: {
        userId: authResult.id,
        educationLevel: body.educationLevel,
        fieldPreference: body.fieldPreference,
        ageRange: body.ageRange,
        gender: body.gender,
        employmentPreference: body.employmentPreference,
        selfEmploymentType: body.selfEmploymentType || null,
        careerSector: body.careerSector,
        unpaidPassion: body.unpaidPassion,
        personalPassion: body.personalPassion,
        lifeGoal: body.lifeGoal,
        futureTitle: body.futureTitle,
        futureTasks: body.futureTasks,
        requiredSkills: body.requiredSkills,
        desiredCourses: body.desiredCourses,
      },
    });

    // Update user progress status
    await db.user.update({
      where: { id: authResult.id },
      data: {
        progressStatus: "ESSAYS_PENDING",
      },
    });

    return successResponse({
      scholarshipAssessment,
      message: "Scholarship assessment created successfully",
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

    const scholarshipAssessment = await db.scholarshipAssessment.upsert({
      where: { userId: authResult.id },
      create: {
        userId: authResult.id,
        educationLevel: body.educationLevel,
        fieldPreference: body.fieldPreference,
        ageRange: body.ageRange,
        gender: body.gender,
        employmentPreference: body.employmentPreference,
        selfEmploymentType: body.selfEmploymentType || null,
        careerSector: body.careerSector,
        unpaidPassion: body.unpaidPassion,
        personalPassion: body.personalPassion,
        lifeGoal: body.lifeGoal,
        futureTitle: body.futureTitle,
        futureTasks: body.futureTasks,
        requiredSkills: body.requiredSkills,
        desiredCourses: body.desiredCourses,
      },
      update: {
        ...(body.educationLevel !== undefined && { educationLevel: body.educationLevel }),
        ...(body.fieldPreference !== undefined && { fieldPreference: body.fieldPreference }),
        ...(body.ageRange !== undefined && { ageRange: body.ageRange }),
        ...(body.gender !== undefined && { gender: body.gender }),
        ...(body.employmentPreference !== undefined && { employmentPreference: body.employmentPreference }),
        ...(body.selfEmploymentType !== undefined && { selfEmploymentType: body.selfEmploymentType }),
        ...(body.careerSector !== undefined && { careerSector: body.careerSector }),
        ...(body.unpaidPassion !== undefined && { unpaidPassion: body.unpaidPassion }),
        ...(body.personalPassion !== undefined && { personalPassion: body.personalPassion }),
        ...(body.lifeGoal !== undefined && { lifeGoal: body.lifeGoal }),
        ...(body.futureTitle !== undefined && { futureTitle: body.futureTitle }),
        ...(body.futureTasks !== undefined && { futureTasks: body.futureTasks }),
        ...(body.requiredSkills !== undefined && { requiredSkills: body.requiredSkills }),
        ...(body.desiredCourses !== undefined && { desiredCourses: body.desiredCourses }),
      },
    });

    // Update user progress if not already done
    const user = await db.user.findUnique({
      where: { id: authResult.id },
      select: { progressStatus: true },
    });

    if (user?.progressStatus === "SCHOLARSHIP_MATRIX_PENDING") {
      await db.user.update({
        where: { id: authResult.id },
        data: {
          progressStatus: "ESSAYS_PENDING",
        },
      });
    }

    return successResponse({
      scholarshipAssessment,
      message: "Scholarship assessment updated successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
