'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts'
import { 
  Users, UserCheck, GraduationCap, ScrollText, 
  TrendingUp, Calendar, Book, Activity 
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ExtendedAnalyticsData } from '@/types/general'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']


export function AnalyticsDashboard({ _data }: { _data: ExtendedAnalyticsData }) {
  const [data, setData] = useState<ExtendedAnalyticsData>(_data)

  // Format user growth data for chart
  const growthData = data.users?.growth?.map(item => ({
    date: `${item?.year}-${item?.month}`,
    users: item?._count
  }))

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.overview?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data?.overview?.activityRate}% active this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Mentors
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.overview?.totalMentors}</div>
            <p className="text-xs text-muted-foreground">
              Supporting {data?.overview?.totalUsers} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Course Engagement
            </CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.engagement?.courseEngagement?.averageProgress}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.overview?.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Of {data?.overview?.totalSubscriptions} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Progress Distribution</CardTitle>
            <CardDescription>User journey stages</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.users?.progressDistribution}
                  dataKey="_count"
                  nameKey="progressStatus"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data?.users?.progressDistribution?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>Average completion rates by course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.learning?.courseCompletions?.map((course) => (
              <div key={course?.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{course?.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {course?._count?.enrollments} enrollments
                  </span>
                </div>
                <Progress value={parseFloat(course?.averageProgress)} />
                <p className="text-sm text-muted-foreground">
                  {course?.averageProgress}% average completion
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Users & Popular Plans */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.users?.recent?.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Badge variant="outline">
                    {user?.progressStatus.replace(/_/g, ' ').toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Plans</CardTitle>
            <CardDescription>Most subscribed packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.subscriptions?.popularPlans?.map((plan) => (
                <div key={plan?.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{plan?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${plan?.price} per month
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {plan?._count?.subscriptions} subscribers
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}