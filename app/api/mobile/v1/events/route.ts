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
    const upcoming = searchParams.get("upcoming") === "true";
    const past = searchParams.get("past") === "true";

    const where: any = {};

    if (upcoming) {
      where.startDate = { gte: new Date() };
    } else if (past) {
      where.endDate = { lt: new Date() };
    }

    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: {
          startDate: upcoming ? "asc" : "desc",
        },
      }),
      db.event.count({ where }),
    ]);

    // Transform events to include isRegistered flag
    const eventsWithRegistration = events.map((event) => ({
      ...event,
      isRegistered: event.users.length > 0,
      registeredCount: event._count.users,
    }));

    return successResponse(
      { events: eventsWithRegistration },
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
