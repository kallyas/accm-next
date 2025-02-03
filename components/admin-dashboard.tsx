"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  GraduationCap,
  ScrollText,
  FileCheck,
  TrendingUp,
  Brain,
  Award,
  Target,
  Book,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExtendedAnalyticsData } from "@/types/general";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];
const PROGRESS_COLORS = {
  PAYMENT_PENDING: "#F59E0B",
  PERSONAL_DISCOVERY_PENDING: "#10B981",
  CV_ALIGNMENT_PENDING: "#4F46E5",
  SCHOLARSHIP_MATRIX_PENDING: "#8B5CF6",
  ESSAYS_PENDING: "#EC4899",
  COMPLETED: "#059669",
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: { value: number; label: string };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {subtitle}
          {trend && (
            <Badge
              variant={trend.value >= 0 ? "default" : "destructive"}
              className="ml-2"
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard({
  _data,
}: {
  _data: ExtendedAnalyticsData;
}) {
  const [data, setData] = useState<ExtendedAnalyticsData>(_data);
  const [timeRange, setTimeRange] = useState("3m");

  // Format data for visualizations
  const growthData = data.users?.growth?.map((item) => ({
    date: `${item.year}-${String(item.month).padStart(2, "0")}`,
    users: item._count,
  }));

  const progressData = data.users?.progressDistribution?.map((item) => ({
    name: item.progressStatus.replace(/_/g, " ").toLowerCase(),
    value: item._count,
    color: PROGRESS_COLORS[item.progressStatus as keyof typeof PROGRESS_COLORS],
  }));

  const userJourneyData = [
    {
      name: "Personal Discovery",
      completed: parseFloat(data.engagement.personalDiscovery.completionRate),
      pending:
        100 - parseFloat(data.engagement.personalDiscovery.completionRate),
    },
    {
      name: "Course Progress",
      completed: parseFloat(data.engagement.courseEngagement.averageProgress),
      pending:
        100 - parseFloat(data.engagement.courseEngagement.averageProgress),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={data.overview.totalUsers}
          subtitle={`${data.overview.activityRate}% active this month`}
          icon={Users}
          trend={{ value: 12, label: "vs last month" }}
        />
        <MetricCard
          title="Course Engagement"
          value={`${data.engagement.courseEngagement.averageProgress}%`}
          subtitle={`${data.engagement.courseEngagement.totalEnrollments} total enrollments`}
          icon={Book}
          trend={{ value: 5, label: "completion rate" }}
        />
        <MetricCard
          title="Personal Discovery"
          value={data.engagement.personalDiscovery.total}
          subtitle={`${data.engagement.personalDiscovery.completionRate}% completion rate`}
          icon={Brain}
        />
        <MetricCard
          title="Active Subscriptions"
          value={data.overview.activeSubscriptions}
          subtitle={`of ${data.overview.totalSubscriptions} total`}
          icon={Award}
          trend={{ value: -2, label: "churn rate" }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>
              Monthly registration and engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#4F46E5"
                  fillOpacity={1}
                  fill="url(#userGrowth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Journey Progress</CardTitle>
            <CardDescription>Distribution across stages</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {progressData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>
            Course completion rates and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.learning.courseCompletions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="_count.enrollments"
                    name="Enrollments"
                    fill="#4F46E5"
                  />
                  <Bar
                    dataKey="averageProgress"
                    name="Completion Rate (%)"
                    fill="#10B981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {data.learning.courseCompletions.map((course) => (
                <div key={course.title} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{course.title}</span>
                    <Badge variant="secondary">
                      {course._count.enrollments} enrolled
                    </Badge>
                  </div>
                  <Progress value={parseFloat(course.averageProgress)} />
                  <p className="text-sm text-muted-foreground">
                    {course.averageProgress}% completion rate
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Progress & Popular Plans */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest platform registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.users.recent.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {user.progressStatus.replace(/_/g, " ").toLowerCase()}
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={data.subscriptions.popularPlans}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="_count.subscriptions" fill="#4F46E5">
                    {data.subscriptions.popularPlans.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
