import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  notFoundError,
  forbiddenError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // Check if notification exists and belongs to user
    const notification = await db.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification) {
      return notFoundError("Notification");
    }

    if (notification.userId !== authResult.id) {
      return forbiddenError("You don't have access to this notification");
    }

    // Mark as read
    const updatedNotification = await db.notification.update({
      where: { id: params.id },
      data: { read: true },
    });

    return successResponse({
      notification: updatedNotification,
      message: "Notification marked as read",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
