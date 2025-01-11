import { NextResponse } from "next/server";
import { db } from "@/lib/db";

async function getOverviewMetrics() {
  return Promise.all([
    // Basic counts
    db.user.count(),
    db.user.count({ where: { role: "MENTOR" } }),
    db.scholarshipAssessment.count(),
    db.subscription.count(),

    // Active users in last 30 days
    db.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    // Active subscriptions
    db.subscription.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);
}

async function getUserInsights() {
  return Promise.all([
    // Recent users
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        progressStatus: true,
        profile: {
          select: {
            avatar: true,
          },
        },
      },
    }),

    // Progress distribution
    db.user.groupBy({
      by: ["progressStatus"],
      _count: true,
    }),

    // User growth trend
    db.user.groupBy({
      by: "createdAt",
      _count: true,
      orderBy: { createdAt: "asc" },
    }),
  ]);
}

async function getEngagementMetrics() {
  return Promise.all([
    // Course engagement
    db.enrollment.aggregate({
      _avg: {
        progress: true,
      },
      _count: {
        id: true,
      },
    }),

    // Personal discovery completion
    db.personalDiscovery.count(),

    // Recent events and participation
    db.event.findMany({
      take: 5,
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        title: true,
        startDate: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    }),

    // CV submissions
    db.cV.count(),
  ]);
}

async function getSubscriptionAnalytics() {
  return Promise.all([
    // Subscription status distribution
    // Subscription status distribution
    db.subscription.groupBy({
      by: ["status"],
      _count: true,
    }) as unknown as any[],

    // Popular plans
    db.plan.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
      orderBy: {
        subscriptions: {
          _count: "desc",
        },
      },
      take: 5,
    }),

    // Payment status distribution
    db.paymentProof.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);
}

async function getLearningProgress() {
  return Promise.all([
    // Course completion rates
    db.course.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
        enrollments: {
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

    // Lesson completion trends
    db.lessonCompletion.groupBy({
      by: ["completedAt"],
      _count: true,
      orderBy: [{ completedAt: "asc" }],
      take: 6,
    }),
  ]);
}

export async function GET() {
  try {
    const [
      // Overview metrics
      [
        totalUsers,
        totalMentors,
        totalScholarships,
        totalSubscriptions,
        activeUsers,
        activeSubscriptions,
      ],
      // User insights
      [recentUsers, progressDistribution, userGrowth],
      // Engagement metrics
      [courseEngagement, personalDiscoveryCount, recentEvents, cvSubmissions],
      // Subscription analytics
      [subscriptionStatus, popularPlans, paymentStatus],
      // Learning progress
      [courseCompletions, lessonCompletions],
    ] = await Promise.all([
      getOverviewMetrics(),
      getUserInsights(),
      getEngagementMetrics(),
      getSubscriptionAnalytics(),
      getLearningProgress(),
    ]);

    // Calculate additional metrics
    const personalDiscoveryRate = (personalDiscoveryCount / totalUsers) * 100;
    const averageCourseCompletion = courseEngagement._avg.progress || 0;

    return NextResponse.json({
      overview: {
        totalUsers,
        totalMentors,
        totalScholarships,
        totalSubscriptions,
        activeUsers,
        activeSubscriptions,
        activityRate: ((activeUsers / totalUsers) * 100).toFixed(1),
      },
      users: {
        recent: recentUsers,
        progressDistribution,
        growth: userGrowth,
      },
      engagement: {
        courseEngagement: {
          averageProgress: averageCourseCompletion.toFixed(1),
          totalEnrollments: courseEngagement._count.id,
        },
        personalDiscovery: {
          total: personalDiscoveryCount,
          completionRate: personalDiscoveryRate.toFixed(1),
        },
        recentEvents,
        cvSubmissions,
      },
      subscriptions: {
        statusDistribution: subscriptionStatus,
        popularPlans,
        paymentStatus,
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
              : 0,
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
