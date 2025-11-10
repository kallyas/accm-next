import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  notFoundError,
  forbiddenError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function DELETE(
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

    // Delete notification
    await db.notification.delete({
      where: { id: params.id },
    });

    return successResponse({
      message: "Notification deleted successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
