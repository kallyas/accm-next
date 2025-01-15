import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { uploadToR2 } from "@/lib/cloudflare-r2";
import { SubscriptionStatus, PaymentStatus } from "@prisma/client"; // Make sure this import is correct

const subscribeSchema = z.object({
  planId: z.string(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("paymentProof") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Payment proof is required" },
        { status: 400 }
      );
    }

    const body = subscribeSchema.parse(Object.fromEntries(formData));

    const plan = await db.plan.findUnique({
      where: { id: body.planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `payment-proof-${session!.user!.id}-${Date.now()}-${
      file.name
    }`;
    const paymentProofUrl = await uploadToR2(buffer, fileName, file.type);

    // check if user already has an active subscription for the plan
    const activeSubscription = await db.subscription.findFirst({
      where: {
        userId: session!.user!.id,
        planId: body.planId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (activeSubscription) {
      return NextResponse.json(
        { error: "You already have an active subscription for this plan" },
        { status: 400 }
      );
    }

    // Create subscription with explicit enum value
    const subscription = await db.subscription.create({
      data: {
        userId: session!.user!.id,
        planId: body.planId,
        startDate: new Date(),
        endDate: new Date(
          Date.now() + plan.duration * 30 * 24 * 60 * 60 * 1000
        ),
        status: SubscriptionStatus.PENDING,
      },
    });

    await db.paymentProof.create({
      data: {
        userId: session!.user!.id,
        subscriptionId: subscription.id,
        imageUrl: paymentProofUrl,
        status: PaymentStatus.PENDING,
      },
    });
    return NextResponse.json({
      message: "Subscription request submitted successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to subscribe to plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
