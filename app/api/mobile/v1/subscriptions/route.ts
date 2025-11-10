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
    const activeOnly = searchParams.get("active") === "true";

    const where: any = { userId: authResult.id };

    if (activeOnly) {
      where.status = "ACTIVE";
    }

    const [subscriptions, total] = await Promise.all([
      db.subscription.findMany({
        where,
        skip,
        take: limit,
        include: {
          plan: true,
          paymentProofs: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.subscription.count({ where }),
    ]);

    return successResponse(
      { subscriptions },
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
