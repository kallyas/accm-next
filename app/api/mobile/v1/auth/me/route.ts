import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  sanitizeUser,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // Fetch user with all relevant data
    const user = await db.user.findUnique({
      where: { id: authResult.id },
      include: {
        profile: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          include: { plan: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        personalDiscovery: true,
        scholarshipAssessment: true,
        cvs: {
          orderBy: { uploadedAt: "desc" },
          take: 1,
        },
        notifications: {
          where: { read: false },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return handleApiError({ code: "P2025" });
    }

    const sanitizedUser = sanitizeUser(user);

    return successResponse({
      user: sanitizedUser,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
