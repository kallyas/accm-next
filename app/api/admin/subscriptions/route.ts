import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getR2Url } from "@/lib/cloudflare-r2";
import { SubscriptionStatus } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { getPlanSubscriptionEmailTemplate } from "@/lib/email-templates/plan-subscription";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session!.user!.role !== "ADMIN") {
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
  if (!session || session!.user!.role !== "ADMIN") {
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
    select: {
      id: true,
      status: true,
      plan: {
        select: {
          name: true,
          duration: true,
          description: true,
        },
      },
      userId: true,
      startDate: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (status === "APPROVED") {
    await db.user.update({
      where: { id: updatedSubscription.userId },
      data: { progressStatus: "PERSONAL_DISCOVERY_PENDING" },
    });

    await sendEmail({
      to: updatedSubscription.user.email,
      subject: "You have successfully subscribed to the program",
      text: `Hello ${updatedSubscription.user.firstName} ${updatedSubscription.user.lastName},\n\nYour subscription has been approved. You can now access the program.\n\nBest regards,\nACCM Team`,
      html: getPlanSubscriptionEmailTemplate({
        userName: `${updatedSubscription.user.firstName} ${updatedSubscription.user.lastName}`,
        planName: updatedSubscription.plan.name,
        planDetails: updatedSubscription.plan.description.split("\n"),
        startDate: updatedSubscription.startDate.toDateString(),
        dashboardUrl: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/dashboard`,
      }),
    });
  }

  return NextResponse.json(updatedSubscription);
}
