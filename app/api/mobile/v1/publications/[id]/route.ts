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

    const publication = await db.publication.findUnique({
      where: { id: params.id },
    });

    if (!publication) {
      return notFoundError("Publication");
    }

    return successResponse({ publication });
  } catch (error: any) {
    return handleApiError(error);
  }
}
