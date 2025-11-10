import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  validationError,
  parseBody,
  validateRequiredFields,
  notFoundError,
  forbiddenError,
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

    const validation = validateRequiredFields(body, ["subscriptionId", "imageUrl"]);
    if (!validation.valid) {
      return validationError(
        "Missing required fields",
        { missing: validation.missing }
      );
    }

    const { subscriptionId, imageUrl } = body;

    // Check if subscription exists and belongs to user
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return notFoundError("Subscription");
    }

    if (subscription.userId !== authResult.id) {
      return forbiddenError("You don't have access to this subscription");
    }

    // Create payment proof
    const paymentProof = await db.paymentProof.create({
      data: {
        userId: authResult.id,
        subscriptionId,
        imageUrl,
        status: "PENDING",
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    return successResponse({
      paymentProof,
      message: "Payment proof submitted successfully. Awaiting admin approval.",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
