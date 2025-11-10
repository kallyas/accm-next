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

    const validation = validateRequiredFields(body, ["content"]);
    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    const { content } = body;

    const feedback = await db.feedback.create({
      data: {
        userId: authResult.id,
        content,
      },
    });

    return successResponse({
      feedback,
      message: "Feedback submitted successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
