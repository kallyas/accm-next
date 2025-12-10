import { NextRequest } from "next/server";
import { extractBearerToken, getUserFromToken } from "@/lib/mobile-jwt";

/**
 * Standard API response format for mobile apps
 */
export interface MobileApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  meta?: Partial<MobileApiResponse["meta"]>
): Response {
  const response: MobileApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  code: string = "UNKNOWN_ERROR",
  status: number = 500,
  details?: any
): Response {
  const response: MobileApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Validation error response
 */
export function validationError(
  message: string,
  details?: any
): Response {
  return errorResponse(message, "VALIDATION_ERROR", 400, details);
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(
  message: string = "Authentication required",
  code: string = "UNAUTHORIZED"
): Response {
  return errorResponse(message, code, 401);
}

/**
 * Token expired error response
 */
export function tokenExpiredError(
  message: string = "Access token has expired"
): Response {
  return errorResponse(message, "TOKEN_EXPIRED", 401);
}

/**
 * Forbidden error response
 */
export function forbiddenError(
  message: string = "Access denied"
): Response {
  return errorResponse(message, "FORBIDDEN", 403);
}

/**
 * Not found error response
 */
export function notFoundError(
  resource: string = "Resource"
): Response {
  return errorResponse(`${resource} not found`, "NOT_FOUND", 404);
}

/**
 * Get authenticated user from JWT token in Authorization header
 * Throws specific errors for token expiration and invalid tokens
 */
export async function getAuthenticatedUser(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | null> {
  const authHeader = req.headers.get("Authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    return null;
  }

  // This will throw TOKEN_EXPIRED, INVALID_TOKEN, or other errors
  // which should be caught and handled by requireAuth
  const user = await getUserFromToken(token);
  return user;
}

/**
 * Require authenticated user middleware
 * Returns specific error responses for different authentication failures
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | Response> {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return unauthorizedError("Authentication required. Please provide a valid access token.");
    }

    return user;
  } catch (error: any) {
    // Handle specific token errors
    if (error.message === "TOKEN_EXPIRED") {
      return tokenExpiredError("Access token has expired. Please refresh your token.");
    }
    if (error.message === "INVALID_TOKEN") {
      return unauthorizedError("Invalid access token. Please login again.", "INVALID_TOKEN");
    }
    if (error.message === "USER_NOT_FOUND") {
      return unauthorizedError("User account not found. Please login again.", "USER_NOT_FOUND");
    }

    // Generic authentication error
    return unauthorizedError("Authentication failed. Please login again.", "AUTH_ERROR");
  }
}

/**
 * Require admin role middleware
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | Response> {
  const user = await requireAuth(req);

  // If requireAuth returned an error response, propagate it
  if (user instanceof Response) {
    return user;
  }

  if (user.role !== "ADMIN") {
    return forbiddenError("Admin access required");
  }

  return user;
}

/**
 * Parse pagination params
 */
export function getPaginationParams(req: NextRequest): {
  page: number;
  limit: number;
  skip: number;
} {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Sanitize user data for public API responses
 */
export function sanitizeUser(user: any) {
  const { password, ...sanitized } = user;
  return sanitized;
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any): Response {
  console.error("API Error:", error);

  if (error.code === "P2002") {
    return errorResponse(
      "A record with this value already exists",
      "DUPLICATE_ERROR",
      409
    );
  }

  if (error.code === "P2025") {
    return notFoundError();
  }

  return errorResponse(
    error.message || "An unexpected error occurred",
    "INTERNAL_ERROR",
    500
  );
}

/**
 * Parse request body safely
 */
export async function parseBody<T = any>(req: NextRequest): Promise<T | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  fields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = fields.filter((field) => !body?.[field]);

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}
