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

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(req);
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("featured") === "true";
    const level = searchParams.get("level");

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    if (level) {
      where.level = level;
    }

    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          learningObjectives: true,
          lessons: {
            select: {
              id: true,
              title: true,
              duration: true,
              order: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          enrollments: {
            where: {
              userId: authResult.id,
            },
            select: {
              id: true,
              progress: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.course.count({ where }),
    ]);

    return successResponse(
      { courses },
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
