import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  errorResponse,
  notFoundError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
      },
    });

    if (!course) {
      return notFoundError("Course");
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: authResult.id,
          courseId: params.id,
        },
      },
    });

    if (existingEnrollment) {
      return errorResponse(
        "Already enrolled in this course",
        "ALREADY_ENROLLED",
        400
      );
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: authResult.id,
        courseId: params.id,
        progress: 0,
      },
      include: {
        course: {
          include: {
            category: true,
            learningObjectives: true,
            lessons: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    return successResponse({
      enrollment,
      message: "Successfully enrolled in course",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
