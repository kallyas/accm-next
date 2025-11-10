import { NextRequest } from "next/server";
import {
  successResponse,
  requireAuth,
} from "@/lib/mobile-api-utils";

export async function POST(req: NextRequest) {
  // Verify authentication (optional - just to validate token)
  const authResult = await requireAuth(req);

  if (authResult instanceof Response) {
    return authResult;
  }

  // For JWT-based auth, logout is handled client-side by removing tokens
  // This endpoint is mainly for future token blacklisting if needed

  return successResponse({
    message: "Logged out successfully. Please remove tokens from client.",
  });
}
