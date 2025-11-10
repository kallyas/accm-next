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

    const { page, limit, skip } = getPaginationParams(req);

    const [registrations, total] = await Promise.all([
      db.userEvent.findMany({
        where: { userId: authResult.id },
        skip,
        take: limit,
        include: {
          event: {
            include: {
              _count: {
                select: {
                  users: true,
                },
              },
            },
          },
        },
        orderBy: {
          event: {
            startDate: "asc",
          },
        },
      }),
      db.userEvent.count({ where: { userId: authResult.id } }),
    ]);

    const events = registrations.map((reg) => ({
      ...reg.event,
      registeredAt: reg.createdAt,
      registeredCount: reg.event._count.users,
    }));

    return successResponse(
      { events },
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
