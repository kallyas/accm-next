import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

async function getOverviewMetrics(start: Date, end: Date) {
  return Promise.all([
    // Basic counts within date range
    db.user.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    db.user.count({
      where: {
        role: "MENTOR",
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    db.subscription.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),

    // Active users in selected period
    db.user.count({
      where: {
        updatedAt: {
          gte: start,
          lte: end,
        },
      },
    }),

    // Active subscriptions in period
    db.subscription.count({
      where: {
        status: "ACTIVE",
        startDate: {
          gte: start,
          lte: end,
        },
      },
    }),
  ]);
}

async function getUserInsights(start: Date, end: Date) {
  return Promise.all([
    // Recent users
    db.user.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        progressStatus: true,
      },
    }),

    // Progress distribution for the period
    db.user.groupBy({
      by: ["progressStatus"],
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
    }),

    // User growth trend by month
    db.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);
}

async function getEngagementMetrics(start: Date, end: Date) {
  return Promise.all([
    // Course engagement within period
    db.enrollment.aggregate({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _avg: {
        progress: true,
      },
      _count: {
        id: true,
      },
    }),

    // Personal discovery completion in period
    db.personalDiscovery.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),

    // CV submissions in period
    db.cV.count({
      where: {
        uploadedAt: {
          gte: start,
          lte: end,
        },
      },
    }),

    // CV submissions trend
    db.cV.groupBy({
      by: ["uploadedAt"],
      where: {
        uploadedAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
      orderBy: {
        uploadedAt: "asc",
      },
    }),
  ]);
}

async function getLearningProgress(start: Date, end: Date) {
  return Promise.all([
    // Course completion rates within period
    db.course.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            enrollments: {
              where: {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
            },
          },
        },
        enrollments: {
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          select: {
            progress: true,
          },
        },
      },
      take: 5,
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
    }),

    // Lesson completions trend
    db.lessonCompletion.groupBy({
      by: ["completedAt"],
      where: {
        completedAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
      orderBy: [{ completedAt: "asc" }],
      take: 6,
    }),
  ]);
}

export async function GET(req: NextRequest) {
  try {
    // Get date range from query parameters
    const searchParams = req.nextUrl.searchParams;
    const start = new Date(
      searchParams.get("start") ||
        new Date().setMonth(new Date().getMonth() - 3)
    );
    const end = new Date(searchParams.get("end") || new Date());

    const [
      // Overview metrics
      [
        totalUsers,
        totalMentors,
        totalSubscriptions,
        activeUsers,
        activeSubscriptions,
      ],
      // User insights
      [recentUsers, progressDistribution, userGrowth],
      // Engagement metrics
      [
        courseEngagement,
        personalDiscoveryCount,
        cvSubmissionsCount,
        cvSubmissionsTrend,
      ],
      // Learning progress
      [courseCompletions, lessonCompletions],
    ] = await Promise.all([
      getOverviewMetrics(start, end),
      getUserInsights(start, end),
      getEngagementMetrics(start, end),
      getLearningProgress(start, end),
    ]);

    // Process monthly growth data
    const monthlyGrowth = userGrowth.reduce((acc: any[], curr: any) => {
      const date = new Date(curr.createdAt);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const existingMonth = acc.find(
        (m) => m.month === month && m.year === year
      );
      if (existingMonth) {
        existingMonth._count += curr._count;
      } else {
        acc.push({ month, year, _count: curr._count });
      }
      return acc;
    }, []);

    // Process CV submissions trend
    const cvGrowth = cvSubmissionsTrend.reduce((acc: any[], curr: any) => {
      const date = new Date(curr.uploadedAt);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const existingMonth = acc.find(
        (m) => m.month === month && m.year === year
      );
      if (existingMonth) {
        existingMonth._count += curr._count;
      } else {
        acc.push({ month, year, _count: curr._count });
      }
      return acc;
    }, []);

    return NextResponse.json({
      overview: {
        totalUsers,
        totalMentors,
        totalSubscriptions,
        activeUsers,
        activeSubscriptions,
        activityRate: ((activeUsers / totalUsers) * 100).toFixed(1),
      },
      users: {
        recent: recentUsers,
        progressDistribution,
        growth: monthlyGrowth,
      },
      engagement: {
        courseEngagement: {
          averageProgress: (courseEngagement._avg.progress || 0).toFixed(1),
          totalEnrollments: courseEngagement._count.id,
        },
        personalDiscovery: {
          total: personalDiscoveryCount,
          completionRate: ((personalDiscoveryCount / totalUsers) * 100).toFixed(
            1
          ),
        },
        cvSubmissions: {
          total: cvSubmissionsCount,
          trend: cvGrowth,
        },
      },
      learning: {
        courseCompletions: courseCompletions.map((course) => ({
          ...course,
          averageProgress:
            course.enrollments.length > 0
              ? (
                  course.enrollments.reduce(
                    (acc, curr) => acc + curr.progress,
                    0
                  ) / course.enrollments.length
                ).toFixed(1)
              : "0",
        })),
        lessonCompletions,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
