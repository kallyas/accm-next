import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  validationError,
  parseBody,
  validateRequiredFields,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await parseBody(req);

    if (!body) {
      return validationError("Invalid request body");
    }

    const validation = validateRequiredFields(body, ["fileName", "fileUrl"]);
    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    const { fileName, fileUrl } = body;

    // Create CV record in database
    const cv = await db.cV.create({
      data: {
        userId: authResult.id,
        fileName,
        fileUrl,
      },
    });

    // Update user progress status if needed
    const user = await db.user.findUnique({
      where: { id: authResult.id },
      select: { progressStatus: true },
    });

    if (user?.progressStatus === "CV_ALIGNMENT_PENDING") {
      await db.user.update({
        where: { id: authResult.id },
        data: {
          progressStatus: "SCHOLARSHIP_MATRIX_PENDING",
        },
      });
    }

    return successResponse({
      cv,
      message: "CV uploaded successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
