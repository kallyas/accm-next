import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getR2Url } from "@/lib/cloudflare-r2";
import { SubscriptionStatus } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { getPlanSubscriptionEmailTemplate } from "@/lib/email-templates/plan-subscription";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session!.user!.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = {};
    
    // Add status filter if provided
    if (status) {
      where.status = status;
    } else {
      // Default to not showing EXPIRED subscriptions
      where.status = {
        notIn: ['EXPIRED']
      };
    }
    
    // Add search filter if provided
    if (search) {
      where.OR = [
        {
          user: {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          plan: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Get total count for pagination
    const total = await db.subscription.count({ where });

    // Get subscriptions with pagination
    const subscriptions = await db.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
            duration: true,
            description: true,
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
      skip,
      take: limit,
    });

    // Process payment proof URLs
    for (const subscription of subscriptions) {
      for (const proof of subscription.paymentProofs) {
        proof.imageUrl = await getR2Url(proof.imageUrl);
      }
    }

    return NextResponse.json({
      data: subscriptions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session!.user!.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, notes } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert string status to enum value
    let validStatus: SubscriptionStatus;
    switch (status) {
      case "APPROVED":
        validStatus = SubscriptionStatus.APPROVED;
        break;
      case "REJECTED":
        validStatus = SubscriptionStatus.REJECTED;
        break;
      case "CANCELLED":
        validStatus = SubscriptionStatus.CANCELLED;
        break;
      case "ACTIVE":
        validStatus = SubscriptionStatus.ACTIVE;
        break;
      case "PENDING":
        validStatus = SubscriptionStatus.PENDING;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
    }

    // Update the subscription
    const data: any = { status: validStatus };
    if (notes !== undefined) {
      data.notes = notes;
    }

    const updatedSubscription = await db.subscription.update({
      where: { id },
      data,
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

    // Additional actions when approving a subscription
    if (status === "APPROVED") {
      // Update user progress status
      await db.user.update({
        where: { id: updatedSubscription.userId },
        data: { progressStatus: "PERSONAL_DISCOVERY_PENDING" },
      });

      // Send confirmation email
      if (updatedSubscription.user.email) {
        await sendEmail({
          to: updatedSubscription.user.email,
          subject: "Your Subscription Has Been Approved",
          text: `Hello ${updatedSubscription.user.firstName} ${updatedSubscription.user.lastName},\n\nYour subscription has been approved. You can now access the program.\n\nBest regards,\nACCM Team`,
          html: getPlanSubscriptionEmailTemplate({
            userName: `${updatedSubscription.user.firstName} ${updatedSubscription.user.lastName}`,
            planName: updatedSubscription.plan.name,
            planDetails: updatedSubscription.plan.description.split("\n"),
            startDate: updatedSubscription.startDate?.toDateString() || new Date().toDateString(),
            dashboardUrl: `${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'https://africanccm'}/dashboard`,
          }),
        });
      }
    }

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}