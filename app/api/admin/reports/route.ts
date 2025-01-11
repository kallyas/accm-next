import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserMetrics() {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  return Promise.all([
    // Monthly user signups
    db.user.groupBy({
      by: [
        { month: { datepart: { date: 'createdAt', datePart: 'month' } } },
        { year: { datepart: { date: 'createdAt', datePart: 'year' } } }
      ],
      _count: true,
      orderBy: [
        { year: { datepart: { date: 'createdAt', datePart: 'year' } } },
        { month: { datepart: { date: 'createdAt', datePart: 'month' } } }
      ],
      take: 12
    }),

    // User demographics
    db.user.groupBy({
      by: ['country'],
      _count: true,
      orderBy: {
        _count: 'desc'
      },
      take: 10
    }),

    // Education level distribution
    db.user.groupBy({
      by: ['educationLevel'],
      _count: true,
      orderBy: {
        _count: 'desc'
      }
    }),

    // Gender distribution
    db.user.groupBy({
      by: ['gender'],
      _count: true
    }),

    // Progress status distribution
    db.user.groupBy({
      by: ['progressStatus'],
      _count: true
    })
  ])
}

async function getSubscriptionMetrics() {
  return Promise.all([
    // Monthly subscription stats
    db.subscription.groupBy({
      by: [
        { month: { datepart: { date: 'createdAt', datePart: 'month' } } },
        { year: { datepart: { date: 'createdAt', datePart: 'year' } } },
        'status'
      ],
      _count: true,
      orderBy: [
        { year: { datepart: { date: 'createdAt', datePart: 'year' } } },
        { month: { datepart: { date: 'createdAt', datePart: 'month' } } }
      ],
      take: 12
    }),

    // Popular plans
    db.plan.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        _count: {
          select: { subscriptions: true }
        }
      },
      orderBy: {
        subscriptions: {
          _count: 'desc'
        }
      }
    }),

    // Payment status distribution
    db.paymentProof.groupBy({
      by: ['status'],
      _count: true
    })
  ])
}

async function getCourseMetrics() {
  return Promise.all([
    // Popular courses
    db.course.findMany({
      select: {
        id: true,
        title: true,
        level: true,
        category: {
          select: { name: true }
        },
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 10
    }),

    // Course completion rates
    db.enrollment.groupBy({
      by: ['courseId'],
      _count: true,
      _avg: {
        progress: true
      },
      having: {
        courseId: {
          _count: {
            gt: 5 // Only courses with more than 5 enrollments
          }
        }
      }
    }),

    // Category distribution
    db.category.findMany({
      select: {
        name: true,
        _count: {
          select: { courses: true }
        }
      }
    })
  ])
}

async function getEngagementMetrics() {
  return Promise.all([
    // Event participation
    db.event.findMany({
      select: {
        title: true,
        startDate: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: {
        startDate: 'desc'
      },
      take: 10
    }),

    // Personal discovery completion rate
    db.user.count({
      where: {
        personalDiscovery: {
          isNot: null
        }
      }
    }),

    // Feedback analysis
    db.feedback.findMany({
      select: {
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
  ])
}

export async function GET() {
  try {
    const [
      [monthlySignups, countryDistribution, educationDistribution, genderDistribution, progressDistribution],
      [subscriptionTrends, popularPlans, paymentStatuses],
      [popularCourses, courseCompletionRates, categoryDistribution],
      [eventParticipation, personalDiscoveryCount, recentFeedback]
    ] = await Promise.all([
      getUserMetrics(),
      getSubscriptionMetrics(),
      getCourseMetrics(),
      getEngagementMetrics()
    ])

    const totalUsers = await db.user.count()
    const completionRate = (personalDiscoveryCount / totalUsers) * 100

    return NextResponse.json({
      userMetrics: {
        monthlySignups,
        countryDistribution,
        educationDistribution,
        genderDistribution,
        progressDistribution,
        totalUsers
      },
      subscriptionMetrics: {
        trends: subscriptionTrends,
        popularPlans,
        paymentStatuses
      },
      courseMetrics: {
        popularCourses,
        completionRates: courseCompletionRates,
        categoryDistribution
      },
      engagementMetrics: {
        eventParticipation,
        personalDiscovery: {
          completionCount: personalDiscoveryCount,
          completionRate: completionRate.toFixed(2)
        },
        recentFeedback
      }
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      }, 
      { status: 500 }
    )
  }
}