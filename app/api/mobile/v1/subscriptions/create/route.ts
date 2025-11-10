import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  validationError,
  parseBody,
  validateRequiredFields,
  notFoundError,
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

    const validation = validateRequiredFields(body, ["planId"]);
    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    const { planId } = body;

    // Check if plan exists
    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return notFoundError("Plan");
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create subscription with PENDING status
    const subscription = await db.subscription.create({
      data: {
        userId: authResult.id,
        planId,
        startDate,
        endDate,
        status: "PENDING",
      },
      include: {
        plan: true,
      },
    });

    return successResponse({
      subscription,
      message: "Subscription created successfully. Please submit payment proof.",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
