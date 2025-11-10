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

    const plans = await db.plan.findMany({
      orderBy: {
        price: "asc",
      },
    });

    return successResponse({ plans });
  } catch (error: any) {
    return handleApiError(error);
  }
}
