import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  notFoundError,
  forbiddenError,
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

    const cv = await db.cV.findUnique({
      where: { id: params.id },
    });

    if (!cv) {
      return notFoundError("CV");
    }

    if (cv.userId !== authResult.id) {
      return forbiddenError("You don't have access to this CV");
    }

    return successResponse({ cv });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const cv = await db.cV.findUnique({
      where: { id: params.id },
    });

    if (!cv) {
      return notFoundError("CV");
    }

    if (cv.userId !== authResult.id) {
      return forbiddenError("You don't have access to this CV");
    }

    await db.cV.delete({
      where: { id: params.id },
    });

    return successResponse({
      message: "CV deleted successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
