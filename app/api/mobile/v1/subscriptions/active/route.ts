import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const activeSubscription = await db.subscription.findFirst({
      where: {
        userId: authResult.id,
        status: "ACTIVE",
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse({
      subscription: activeSubscription,
      hasActiveSubscription: !!activeSubscription,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
