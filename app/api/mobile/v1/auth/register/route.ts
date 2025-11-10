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

    const validation = validateRequiredFields(body, [
      "firstName",
      "lastName",
      "email",
      "password",
    ]);

    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    const { firstName, lastName, email, password, phone, gender, country, educationLevel } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return validationError("Invalid email format");
    }

    // Validate password strength
    if (password.length < 8) {
      return validationError("Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return errorResponse(
        "User with this email already exists",
        "EMAIL_EXISTS",
        409
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || null,
        gender: gender || null,
        country: country || null,
        educationLevel: educationLevel || null,
        role: "USER",
        progressStatus: "PAYMENT_PENDING",
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });

    // Generate JWT tokens
    const tokens = generateTokenPair(user.id, user.email, user.role);

    // Sanitize and return user data
    const sanitizedUser = sanitizeUser(user);

    return successResponse(
      {
        user: sanitizedUser,
        tokens,
        message: "Registration successful",
      },
      { timestamp: new Date().toISOString() }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return errorResponse(
      error.message || "Registration failed",
      "REGISTRATION_ERROR",
      500
    );
  }
}
