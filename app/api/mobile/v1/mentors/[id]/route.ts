import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  notFoundError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const mentor = await db.mentor.findUnique({
      where: { id: params.id },
    });

    if (!mentor) {
      return notFoundError("Mentor");
    }

    return successResponse({ mentor });
  } catch (error: any) {
    return handleApiError(error);
  }
}
