import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  validationError,
  parseBody,
  validateRequiredFields,
} from "@/lib/mobile-api-utils";
import { verifyToken, generateTokenPair } from "@/lib/mobile-jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);

    if (!body) {
      return validationError("Invalid request body");
    }

    const validation = validateRequiredFields(body, ["refreshToken"]);
    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    const { refreshToken } = body;

    // Verify refresh token
    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch (error: any) {
      if (error.message === "TOKEN_EXPIRED") {
        return errorResponse(
          "Refresh token has expired. Please login again.",
          "REFRESH_TOKEN_EXPIRED",
          401
        );
      }
      return errorResponse(
        "Invalid refresh token",
        "INVALID_REFRESH_TOKEN",
        401
      );
    }

    // Verify token type
    if (payload.type !== "refresh") {
      return errorResponse(
        "Invalid token type. Expected refresh token.",
        "INVALID_TOKEN_TYPE",
        401
      );
    }

    // Verify user still exists
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return errorResponse(
        "User not found",
        "USER_NOT_FOUND",
        404
      );
    }

    // Generate new token pair
    const tokens = generateTokenPair(user.id, user.email, user.role);

    return successResponse({
      tokens,
      message: "Tokens refreshed successfully",
    });
  } catch (error: any) {
    console.error("Token refresh error:", error);
    return errorResponse(
      error.message || "Token refresh failed",
      "REFRESH_ERROR",
      500
    );
  }
}
