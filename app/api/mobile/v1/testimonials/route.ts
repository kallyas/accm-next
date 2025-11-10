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

    const [testimonials, total] = await Promise.all([
      db.testimonial.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.testimonial.count(),
    ]);

    return successResponse(
      { testimonials },
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
