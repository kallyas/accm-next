import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const plans = await db.plan.findMany({
      include: {
        services: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      services: plan.services.map((service) => service.name),
      features: [], // Placeholder for features - add as needed
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
