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
import { Users, Brain, Award, Book, Loader2 } from "lucide-react";
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
import { useTheme } from "next-themes";

// Theme-aware colors
const getThemeColors = (theme: "dark" | "light") => ({
  primary: theme === "dark" ? "#94A3B8" : "#475569",
  secondary: theme === "dark" ? "#1E293B" : "#F1F5F9",
  accent: theme === "dark" ? "#3B82F6" : "#2563EB",
  text: theme === "dark" ? "#F1F5F9" : "#1E293B",
  muted: theme === "dark" ? "#64748B" : "#94A3B8",
  chartColors: {
    primary:
      theme === "dark"
        ? ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
        : ["#2563EB", "#059669", "#D97706", "#DC2626"],
    progressStates: {
      PAYMENT_PENDING: theme === "dark" ? "#F59E0B" : "#D97706",
      PERSONAL_DISCOVERY_PENDING: theme === "dark" ? "#10B981" : "#059669",
      CV_ALIGNMENT_PENDING: theme === "dark" ? "#3B82F6" : "#2563EB",
      SCHOLARSHIP_MATRIX_PENDING: theme === "dark" ? "#8B5CF6" : "#7C3AED",
      ESSAYS_PENDING: theme === "dark" ? "#EC4899" : "#DB2777",
      COMPLETED: theme === "dark" ? "#059669" : "#047857",
    },
  },
});

interface DateRange {
  start: Date;
  end: Date;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isLoading,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: { value: number; label: string };
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-7 w-[60px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground">{subtitle}</span>
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
  const [isLoading, setIsLoading] = useState(false);
  const { theme = "light" } = useTheme();
  const colors = getThemeColors(theme as "dark" | "light");

  // Function to calculate date range based on selected time range
  const getDateRange = (range: string): DateRange => {
    const end = new Date();
    const start = new Date();
    switch (range) {
      case "1m":
        start.setMonth(end.getMonth() - 1);
        break;
      case "3m":
        start.setMonth(end.getMonth() - 3);
        break;
      case "6m":
        start.setMonth(end.getMonth() - 6);
        break;
      case "1y":
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setMonth(end.getMonth() - 3);
    }
    return { start, end };
  };

  // Fetch data with date range
  const fetchData = async (range: string) => {
    setIsLoading(true);
    try {
      const dateRange = getDateRange(range);
      const params = new URLSearchParams({
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      });

      const response = await fetch(`/api/admin/analytics?${params}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics Overview
        </h2>
        <div className="flex items-center gap-4">
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
          {isLoading && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={data.overview.totalUsers}
          subtitle={`${data.overview.activityRate}% active`}
          icon={Users}
          trend={{ value: 12, label: "growth" }}
          isLoading={isLoading}
        />
        <MetricCard
          title="Course Engagement"
          value={`${data.engagement.courseEngagement.averageProgress}%`}
          subtitle={`${data.engagement.courseEngagement.totalEnrollments} enrolled`}
          icon={Book}
          isLoading={isLoading}
        />
        <MetricCard
          title="Personal Discovery"
          value={data.engagement.personalDiscovery.total}
          subtitle={`${data.engagement.personalDiscovery.completionRate}% completed`}
          icon={Brain}
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Subscriptions"
          value={data.overview.activeSubscriptions}
          subtitle={`of ${data.overview.totalSubscriptions} total`}
          icon={Award}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly registration trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.users.growth.map((item) => ({
                    date: `${item.year}-${String(item.month).padStart(2, "0")}`,
                    users: item._count,
                  }))}
                >
                  <defs>
                    <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={colors.chartColors.primary[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={colors.chartColors.primary[0]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} />
                  <XAxis dataKey="date" stroke={colors.text} />
                  <YAxis stroke={colors.text} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.secondary,
                      borderColor: colors.muted,
                      color: colors.text,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={colors.chartColors.primary[0]}
                    fill="url(#userGrowth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>User Journey Stages</CardTitle>
            <CardDescription>Current progress distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.users.progressDistribution}
                    dataKey="_count"
                    nameKey="progressStatus"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {data.users.progressDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          colors.chartColors.progressStates[
                            entry.progressStatus as keyof typeof colors.chartColors.progressStates
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.secondary,
                      borderColor: colors.muted,
                      color: colors.text,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Performance */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Enrollment and completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.learning.courseCompletions}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} />
                  <XAxis dataKey="title" stroke={colors.text} />
                  <YAxis stroke={colors.text} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.secondary,
                      borderColor: colors.muted,
                      color: colors.text,
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="_count.enrollments"
                    name="Enrollments"
                    fill={colors.chartColors.primary[0]}
                  />
                  <Bar
                    dataKey="averageProgress"
                    name="Completion Rate (%)"
                    fill={colors.chartColors.primary[1]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
