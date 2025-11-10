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

    const [publications, total] = await Promise.all([
      db.publication.findMany({
        skip,
        take: limit,
        orderBy: {
          publishedDate: "desc",
        },
      }),
      db.publication.count(),
    ]);

    return successResponse(
      { publications },
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
