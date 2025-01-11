import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getR2Url } from "@/lib/cloudflare-r2";
import { SubscriptionStatus } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session!.user!.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriptions = await db.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      paymentProofs: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  for (const subscription of subscriptions) {
    for (const proof of subscription.paymentProofs) {
      proof.imageUrl = await getR2Url(proof.imageUrl);
    }
  }

  return NextResponse.json(subscriptions);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session!.user!.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();
  let validStatus = null;
  if (status === "APPROVED") {
    validStatus = SubscriptionStatus.ACTIVE;
  } else if (status === "REJECTED") {
    validStatus = SubscriptionStatus.CANCELLED;
  } else {
    validStatus = SubscriptionStatus.PENDING;
  }

  const updatedSubscription = await db.subscription.update({
    where: { id },
    data: { status: validStatus },
  });

  if (status === "APPROVED") {
    await db.user.update({
      where: { id: updatedSubscription.userId },
      data: { progressStatus: "PERSONAL_DISCOVERY_PENDING" },
    });
  }

  return NextResponse.json(updatedSubscription);
}
