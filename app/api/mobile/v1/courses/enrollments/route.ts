import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  getPaginationParams,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const { page, limit, skip } = getPaginationParams(req);

    const [enrollments, total] = await Promise.all([
      db.enrollment.findMany({
        where: { userId: authResult.id },
        skip,
        take: limit,
        include: {
          course: {
            include: {
              category: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  order: true,
                  duration: true,
                },
              },
            },
          },
          completedLessons: {
            select: {
              lessonId: true,
              completedAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.enrollment.count({ where: { userId: authResult.id } }),
    ]);

    return successResponse(
      { enrollments },
      {
        page,
        limit,
        total,
      }
    );
  } catch (error: any) {
    return handleApiError(error);
  }
}
