import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  errorResponse,
  notFoundError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: params.id },
      include: {
        users: {
          where: {
            userId: authResult.id,
          },
        },
      },
    });

    if (!event) {
      return notFoundError("Event");
    }

    // Check if already registered
    if (event.users.length > 0) {
      return errorResponse(
        "Already registered for this event",
        "ALREADY_REGISTERED",
        400
      );
    }

    // Check if event has already ended
    if (new Date(event.endDate) < new Date()) {
      return errorResponse(
        "Cannot register for past events",
        "EVENT_ENDED",
        400
      );
    }

    // Register for event
    await db.userEvent.create({
      data: {
        userId: authResult.id,
        eventId: params.id,
      },
    });

    return successResponse({
      message: "Successfully registered for event",
      eventId: params.id,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
