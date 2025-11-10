import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // Mark all user's notifications as read
    const result = await db.notification.updateMany({
      where: {
        userId: authResult.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return successResponse({
      message: "All notifications marked as read",
      count: result.count,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
