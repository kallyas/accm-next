import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
