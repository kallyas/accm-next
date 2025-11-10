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
  message: string = "Authentication required"
): Response {
  return errorResponse(message, "UNAUTHORIZED", 401);
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
 */
export async function getAuthenticatedUser(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      return null;
    }

    const user = await getUserFromToken(token);
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Require authenticated user middleware
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | Response> {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return unauthorizedError();
  }

  return user;
}

/**
 * Require admin role middleware
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | Response> {
  const user = await requireAuth(req);

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
