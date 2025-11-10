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
    const { searchParams } = new URL(req.url);
    const expertise = searchParams.get("expertise");

    const where: any = {};

    if (expertise) {
      where.expertise = {
        has: expertise,
      };
    }

    const [mentors, total] = await Promise.all([
      db.mentor.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.mentor.count({ where }),
    ]);

    return successResponse(
      { mentors },
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
