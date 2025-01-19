import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.number().int().min(1, "Duration must be at least 1"),
  services: z.array(z.string()).min(1, "At least one service is required"),
  features: z.array(z.string()),
});


export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { role: string };
    };

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // First check if plan exists
    const planExists = await db.plan.findUnique({
      where: { id },
    });

    if (!planExists) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Use a transaction to ensure all deletions succeed or none do
    const deletedPlan = await db.$transaction(async (tx) => {
      // Delete all payment proofs associated with subscriptions of this plan
      await tx.paymentProof.deleteMany({
        where: {
          subscription: {
            planId: id,
          },
        },
      });

      // Delete all subscriptions for the plan
      await tx.subscription.deleteMany({
        where: { planId: id },
      });

      // Delete plan feature

      // Finally delete the plan itself
      return tx.plan.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      message: "Plan and associated data deleted successfully",
      plan: deletedPlan,
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: { role: string };
    };

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const json = await req.json();

    // transform price and duration to numbers from strings
    json.price = parseFloat(json.price);
    json.duration = parseInt(json.duration);

    const body = planSchema.parse(json);

    const updatedPlan = await db.plan.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}