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

    const [cvs, total] = await Promise.all([
      db.cV.findMany({
        where: { userId: authResult.id },
        skip,
        take: limit,
        orderBy: {
          uploadedAt: "desc",
        },
      }),
      db.cV.count({ where: { userId: authResult.id } }),
    ]);

    return successResponse(
      { cvs },
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
