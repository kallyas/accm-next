// app/api/admin/marketing/campaigns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [campaigns, total] = await Promise.all([
      db.marketingCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          creator: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              emailLogs: true,
            },
          },
        },
      }),
      db.marketingCampaign.count({ where }),
    ]);

    // Calculate metrics for each campaign
    const campaignsWithMetrics = await Promise.all(
      campaigns.map(async (campaign) => {
        const emailStats = await db.emailLog.groupBy({
          by: ["status"],
          where: { campaignId: campaign.id },
          _count: true,
        });

        const stats = emailStats.reduce(
          (acc, stat) => {
            (acc as Record<string, number>)[stat.status.toLowerCase()] = stat._count;
            return acc;
          },
          { sent: 0, failed: 0, opened: 0, clicked: 0 }
        );

        const openRate = stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : "0";
        const clickRate = stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(1) : "0";

        return {
          ...campaign,
          stats,
          openRate: `${openRate}%`,
          clickRate: `${clickRate}%`,
        };
      })
    );

    return NextResponse.json({
      campaigns: campaignsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

