export type PersonalDiscoveryData = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  achievements: string[];
  threats: string[];
  familyAspirations: string[];
  careerAspirations: string[];
  financialBusinessAspirations: string[];
  socialAspirations: string[];
  desiredPosition: string[];
  requiredSkills: string[];
  coursesAndTrainings: string[];
  strategies: string[];
  shortTermGoals: string[];
};


export interface ExtendedAnalyticsData {
  overview: {
    totalUsers: number
    totalMentors: number
    totalScholarships: number
    totalSubscriptions: number
    activeUsers: number
    activeSubscriptions: number
    activityRate: string
  }
  users: {
    recent: Array<{
      id: string
      firstName: string
      lastName: string
      email: string
      createdAt: string
      progressStatus: string
    }>
    progressDistribution: Array<{
      progressStatus: string
      _count: number
    }>
    growth: Array<{
      month: number
      year: number
      _count: number
    }>
  }
  engagement: {
    courseEngagement: {
      averageProgress: string
      totalEnrollments: number
    }
    personalDiscovery: {
      total: number
      completionRate: string
    }
    cvSubmissions: Array<{
      month: number
      year: number
      _count: number
    }>
  }
  subscriptions: {
    statusDistribution: Array<{
      status: string
      _count: number
    }>
    popularPlans: Array<{
      name: string
      price: number
      _count: {
        subscriptions: number
      }
    }>
  }
  learning: {
    courseCompletions: Array<{
      title: string
      averageProgress: string
      _count: {
        enrollments: number
      }
    }>
  }
}
