import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  notFoundError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const event = await db.event.findUnique({
      where: { id: params.id },
      include: {
        users: {
          where: {
            userId: authResult.id,
          },
          select: {
            userId: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!event) {
      return notFoundError("Event");
    }

    const eventWithRegistration = {
      ...event,
      isRegistered: event.users.length > 0,
      registeredCount: event._count.users,
    };

    return successResponse({ event: eventWithRegistration });
  } catch (error: any) {
    return handleApiError(error);
  }
}
