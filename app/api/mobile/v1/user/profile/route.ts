import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  validationError,
  parseBody,
  sanitizeUser,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const user = await db.user.findUnique({
      where: { id: authResult.id },
      include: {
        profile: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          include: { plan: true },
        },
      },
    });

    if (!user) {
      return handleApiError({ code: "P2025" });
    }

    return successResponse({
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await parseBody(req);

    if (!body) {
      return validationError("Invalid request body");
    }

    const {
      firstName,
      lastName,
      phone,
      gender,
      country,
      educationLevel,
      bio,
      phoneNumber,
      address,
    } = body;

    // Update user data
    const updatedUser = await db.user.update({
      where: { id: authResult.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(gender && { gender }),
        ...(country && { country }),
        ...(educationLevel && { educationLevel }),
        profile: {
          upsert: {
            create: {
              bio: bio || null,
              phoneNumber: phoneNumber || null,
              address: address || null,
            },
            update: {
              ...(bio !== undefined && { bio }),
              ...(phoneNumber !== undefined && { phoneNumber }),
              ...(address !== undefined && { address }),
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return successResponse({
      user: sanitizeUser(updatedUser),
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
