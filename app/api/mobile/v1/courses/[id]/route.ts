import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  notFoundError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const course = await db.course.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        learningObjectives: true,
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
        enrollments: {
          where: {
            userId: authResult.id,
          },
          include: {
            completedLessons: {
              select: {
                lessonId: true,
                completedAt: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return notFoundError("Course");
    }

    return successResponse({ course });
  } catch (error: any) {
    return handleApiError(error);
  }
}
