import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: "access" | "refresh";
}

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(userId: string, email: string, role: string): string {
  const payload: TokenPayload = {
    userId,
    email,
    role,
    type: "access",
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: "pearl-hub-mobile",
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(userId: string, email: string, role: string): string {
  const payload: TokenPayload = {
    userId,
    email,
    role,
    type: "refresh",
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: "pearl-hub-mobile",
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(userId: string, email: string, role: string) {
  return {
    accessToken: generateAccessToken(userId, email, role),
    refreshToken: generateRefreshToken(userId, email, role),
    expiresIn: 900, // 15 minutes in seconds
    tokenType: "Bearer",
  };
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "pearl-hub-mobile",
    }) as TokenPayload;

    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("TOKEN_EXPIRED");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("INVALID_TOKEN");
    }
    throw new Error("TOKEN_VERIFICATION_FAILED");
  }
}

/**
 * Extract token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Verify user exists and is active
 */
export async function verifyUserExists(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  return !!user;
}

/**
 * Get user info from token
 */
export async function getUserFromToken(token: string) {
  const payload = verifyToken(token);

  // Verify user still exists
  const userExists = await verifyUserExists(payload.userId);
  if (!userExists) {
    throw new Error("USER_NOT_FOUND");
  }

  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}
