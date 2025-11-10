import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  errorResponse,
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

    // Check if registered
    const registration = await db.userEvent.findUnique({
      where: {
        userId_eventId: {
          userId: authResult.id,
          eventId: params.id,
        },
      },
    });

    if (!registration) {
      return errorResponse(
        "Not registered for this event",
        "NOT_REGISTERED",
        400
      );
    }

    // Unregister from event
    await db.userEvent.delete({
      where: {
        userId_eventId: {
          userId: authResult.id,
          eventId: params.id,
        },
      },
    });

    return successResponse({
      message: "Successfully unregistered from event",
      eventId: params.id,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
