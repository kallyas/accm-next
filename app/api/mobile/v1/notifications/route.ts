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
    const unreadOnly = searchParams.get("unread") === "true";

    const where: any = { userId: authResult.id };

    if (unreadOnly) {
      where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.notification.count({ where }),
      db.notification.count({
        where: {
          userId: authResult.id,
          read: false,
        },
      }),
    ]);

    return successResponse(
      {
        notifications,
        unreadCount,
      },
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
