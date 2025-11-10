import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  successResponse,
  errorResponse,
  validationError,
  parseBody,
  validateRequiredFields,
  sanitizeUser,
} from "@/lib/mobile-api-utils";
import { generateTokenPair } from "@/lib/mobile-jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);

    if (!body) {
      return validationError("Invalid request body");
    }

    const validation = validateRequiredFields(body, ["email", "password"]);
    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    const { email, password } = body;

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        profile: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          include: { plan: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return errorResponse("Invalid credentials", "INVALID_CREDENTIALS", 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse("Invalid credentials", "INVALID_CREDENTIALS", 401);
    }

    // Generate JWT tokens
    const tokens = generateTokenPair(user.id, user.email, user.role);

    // Sanitize and return user data
    const sanitizedUser = sanitizeUser(user);

    return successResponse({
      user: sanitizedUser,
      tokens,
      message: "Login successful",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return errorResponse(
      error.message || "Login failed",
      "LOGIN_ERROR",
      500
    );
  }
}
