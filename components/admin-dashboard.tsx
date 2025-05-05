"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { 
  Users, 
  Brain, 
  Award, 
  Book, 
  TrendingUp, 
  TrendingDown,
  BarChart2,
  ArrowUpRight,
  Bookmark,
  Clock,
  RefreshCw,
  Download,
  FileDown,
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Enhanced theme-aware colors
const getThemeColors = (theme: "dark" | "light") => ({
  primary: theme === "dark" ? "#94A3B8" : "#475569",
  secondary: theme === "dark" ? "#1E293B" : "#F1F5F9",
  accent: theme === "dark" ? "#3B82F6" : "#2563EB",
  text: theme === "dark" ? "#F1F5F9" : "#1E293B",
  muted: theme === "dark" ? "#64748B" : "#94A3B8",
  success: theme === "dark" ? "#10B981" : "#059669",
  warning: theme === "dark" ? "#F59E0B" : "#D97706",
  danger: theme === "dark" ? "#EF4444" : "#DC2626",
  chartColors: {
    primary: theme === "dark"
      ? ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#A855F7", "#EC4899", "#14B8A6"]
      : ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED", "#DB2777", "#0D9488"],
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
  variant = "default",
  actions,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: { value: number; label: string };
  isLoading?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
  actions?: React.ReactNode;
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

  // Color variants for the trend badge
  const variantClasses = {
    default: "",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  // Trend icon based on value
  const TrendIcon = trend && trend.value >= 0 ? TrendingUp : TrendingDown;
  const trendColorClass = trend && trend.value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{subtitle}</span>
            {trend && (
              <div className="flex items-center space-x-1">
                <TrendIcon className={`h-3 w-3 ${trendColorClass}`} />
                <span className={`text-xs font-medium ${trendColorClass}`}>
                  {trend.value >= 0 ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
            )}
          </div>
          {actions && (
            <div className="pt-2 mt-2 border-t border-border flex justify-end">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label, theme }: any) => {
  const colors = getThemeColors(theme as "dark" | "light");
  
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip p-3 bg-background border border-border rounded-md shadow-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center space-x-2">
            <div 
              className="h-2 w-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function AnalyticsDashboard({
  _data,
}: {
  _data: ExtendedAnalyticsData;
}) {
  const [data, setData] = useState<ExtendedAnalyticsData>(_data);
  const [timeRange, setTimeRange] = useState("3m");
  const [isLoading, setIsLoading] = useState(false);
  const [chartView, setChartView] = useState("overview");
  const { theme = "light", setTheme } = useTheme();
  const colors = getThemeColors(theme as "dark" | "light");

  // Calculate percentage change for the metrics
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, label: "no change" };
    const change = ((current - previous) / previous) * 100;
    return {
      value: parseFloat(change.toFixed(1)),
      label: change >= 0 ? "increase" : "decrease",
    };
  };

  // Prepare data for monthly user trends
  const userTrends = useMemo(() => {
    if (!data?.users?.growth) return [];
    
    // Transform data for chart
    return data.users.growth.map((item) => ({
      date: `${item.year}-${String(item.month).padStart(2, "0")}`,
      users: item._count,
    }));
  }, [data]);

  // Prepare data for user progress distribution
  const progressData = useMemo(() => {
    if (!data?.users?.progressDistribution) return [];
    
    // Transform status names to be more readable
    return data.users.progressDistribution.map(item => ({
      name: item.progressStatus
        .replace(/_/g, ' ')
        .replace('PENDING', '')
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      value: item._count,
      originalStatus: item.progressStatus
    }));
  }, [data]);

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

  // Course performance data calculation
  const coursePerformanceData = useMemo(() => {
    if (!data?.learning?.courseCompletions) return [];
    
    return data.learning.courseCompletions.map(course => ({
      name: course.title,
      enrollments: course._count.enrollments,
      completionRate: parseFloat(course.averageProgress),
    }));
  }, [data]);

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={chartView === "overview" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartView("overview")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={chartView === "users" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartView("users")}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button
            variant={chartView === "courses" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartView("courses")}
          >
            <Book className="h-4 w-4 mr-2" />
            Courses
          </Button>
        </div>
        <div className="flex items-center gap-2">
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => fetchData(timeRange)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <FileDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileDown className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Conditional rendering based on selected view */}
      {chartView === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Users"
              value={data.overview.totalUsers}
              subtitle={`${data.overview.activityRate}% active`}
              icon={Users}
              trend={calculateTrend(data.overview.totalUsers, data.overview.previousTotalUsers || 0)}
              isLoading={isLoading}
              actions={
                <Button variant="ghost" size="sm" className="text-xs">
                  View details
                </Button>
              }
            />
            <MetricCard
              title="Course Engagement"
              value={`${data.engagement.courseEngagement.averageProgress}%`}
              subtitle={`${data.engagement.courseEngagement.totalEnrollments} enrolled`}
              icon={Book}
              isLoading={isLoading}
              variant="success"
              trend={calculateTrend(
                data.engagement.courseEngagement.averageProgress,
                data.engagement.courseEngagement.previousAverageProgress || 0
              )}
            />
            <MetricCard
              title="Personal Discovery"
              value={data.engagement.personalDiscovery.total}
              subtitle={`${data.engagement.personalDiscovery.completionRate}% completed`}
              icon={Brain}
              isLoading={isLoading}
              trend={calculateTrend(
                data.engagement.personalDiscovery.completionRate,
                data.engagement.personalDiscovery.previousCompletionRate || 0
              )}
            />
            <MetricCard
              title="Active Subscriptions"
              value={data.overview.activeSubscriptions}
              subtitle={`of ${data.overview.totalSubscriptions} total`}
              icon={Award}
              isLoading={isLoading}
              trend={calculateTrend(
                data.overview.activeSubscriptions,
                data.overview.previousActiveSubscriptions || 0
              )}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Growth */}
            <Card className="col-span-2 md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly registration trend</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View full report</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userTrends}>
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
                      <ChartTooltip content={(props) => <CustomTooltip {...props} theme={theme} />} />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke={colors.chartColors.primary[0]}
                        fill="url(#userGrowth)"
                        name="New Users"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <CardFooter className="px-0 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    <ArrowUpRight className="inline h-3 w-3 mr-1" />
                    {data.users.growthRate || "3.2"}% growth rate
                  </span>
                  <span>
                    <Clock className="inline h-3 w-3 mr-1" />
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </CardFooter>
              </CardContent>
            </Card>

            {/* Progress Distribution */}
            <Card className="col-span-2 md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>User Journey Stages</CardTitle>
                  <CardDescription>Current progress distribution</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View full report</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {progressData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              colors.chartColors.progressStates[
                                entry.originalStatus as keyof typeof colors.chartColors.progressStates
                              ] || colors.chartColors.primary[index % colors.chartColors.primary.length]
                            }
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={(props) => <CustomTooltip {...props} theme={theme} />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <CardFooter className="px-0 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    <Bookmark className="inline h-3 w-3 mr-1" />
                    Most common: {progressData.length > 0 ? progressData.sort((a, b) => b.value - a.value)[0].name : "N/A"}
                  </span>
                  <span>
                    <Users className="inline h-3 w-3 mr-1" />
                    Total users: {progressData.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                </CardFooter>
              </CardContent>
            </Card>

            {/* Course Performance */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Enrollment and completion rates</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View as table</DropdownMenuItem>
                    <DropdownMenuItem>Sort by enrollments</DropdownMenuItem>
                    <DropdownMenuItem>Sort by completion</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Export data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coursePerformanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} />
                      <XAxis type="number" stroke={colors.text} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke={colors.text} 
                        width={150}
                        tick={({ x, y, payload }) => (
                          <text 
                            x={x} 
                            y={y} 
                            textAnchor="end" 
                            fill={colors.text} 
                            fontSize={12}
                          >
                            {payload.value.length > 20 
                              ? `${payload.value.substring(0, 20)}...` 
                              : payload.value}
                          </text>
                        )}
                      />
                      <ChartTooltip content={(props) => <CustomTooltip {...props} theme={theme} />} />
                      <Legend />
                      <Bar 
                        dataKey="enrollments" 
                        name="Enrollments" 
                        fill={colors.chartColors.primary[0]}
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar 
                        dataKey="completionRate" 
                        name="Completion Rate (%)" 
                        fill={colors.chartColors.primary[1]}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {data.learning.courseCompletions.slice(0, 4).map((course) => (
                    <div key={course.title} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {course.title.length > 30 
                            ? `${course.title.substring(0, 30)}...` 
                            : course.title}
                        </span>
                        <Badge variant="secondary">
                          {course._count.enrollments} enrolled
                        </Badge>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {course.averageProgress}% completed
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-medium text-muted-foreground">
                              Target: 80%
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2 w-full bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 dark:bg-blue-400 h-full rounded-full" 
                            style={{ width: `${course.averageProgress}%` }}
                          />
                          <div 
                            className="absolute top-0 h-full rounded-full border-l-2 border-red-400 dark:border-red-500" 
                            style={{ left: '80%' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {data.learning.courseCompletions.length > 4 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" size="sm">
                      View all courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Users View */}
      {chartView === "users" && (
        <div className="space-y-6">
          {/* User Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">
                  {data.overview.totalUsers}
                </h3>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <div className="mt-4">
                  <Progress value={data.overview.activityRate} className="h-2" />
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  {data.overview.activityRate}% active in last 30 days
                </p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">
                  {data.users.averageCompletionTime || "45"}
                </h3>
                <p className="text-sm text-muted-foreground">Avg. Days to Complete</p>
                <div className="flex justify-center mt-4">
                  <Badge variant={data.users.averageCompletionTime <= 60 ? "default" : "destructive"}>
                    {data.users.averageCompletionTime <= 60 ? "On Target" : "Above Target"}
                  </Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">
                  {data.users.retentionRate || "78"}%
                </h3>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <div className="flex justify-center items-center gap-2 mt-4">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500">+2.4% from last period</span>
                </div>
              </div>
            </Card>
          </div>

          {/* User Demographics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>Distribution by age group and region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="80%" 
                    data={[
                      { subject: 'Africa', A: 120, B: 110, fullMark: 150 },
                      { subject: 'Americas', A: 98, B: 130, fullMark: 150 },
                      { subject: 'Asia', A: 86, B: 130, fullMark: 150 },
                      { subject: 'Europe', A: 99, B: 100, fullMark: 150 },
                      { subject: 'Oceania', A: 85, B: 90, fullMark: 150 },
                    ]}
                  >
                    <PolarGrid stroke={colors.muted} />
                    <PolarAngleAxis dataKey="subject" stroke={colors.text} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke={colors.text} />
                    <Radar
                      name="18-24"
                      dataKey="A"
                      stroke={colors.chartColors.primary[0]}
                      fill={colors.chartColors.primary[0]}
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="25-34"
                      dataKey="B"
                      stroke={colors.chartColors.primary[1]}
                      fill={colors.chartColors.primary[1]}
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <ChartTooltip content={(props) => <CustomTooltip {...props} theme={theme} />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Courses View */}
      {chartView === "courses" && (
        <div className="space-y-6">
          {/* Course Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Total Courses"
              value={data.learning.courseCompletions.length}
              subtitle="Active courses"
              icon={Book}
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Enrollments"
              value={data.engagement.courseEngagement.totalEnrollments}
              subtitle="Across all courses"
              icon={Users}
              isLoading={isLoading}
              trend={calculateTrend(
                data.engagement.courseEngagement.totalEnrollments,
                data.engagement.courseEngagement.previousTotalEnrollments || 0
              )}
            />
            <MetricCard
              title="Avg. Completion"
              value={`${data.engagement.courseEngagement.averageProgress}%`}
              subtitle="Completion rate"
              icon={Award}
              isLoading={isLoading}
            />
            <MetricCard
              title="Most Popular"
              value={data.learning.courseCompletions[0]?.title.slice(0, 15) + "..." || "N/A"}
              subtitle={`${data.learning.courseCompletions[0]?._count.enrollments || 0} enrollments`}
              icon={Bookmark}
              isLoading={isLoading}
            />
          </div>

          {/* Course Performance Detailed */}
          <Card>
            <CardHeader>
              <CardTitle>Course Performance Detailed</CardTitle>
              <CardDescription>Enrollment, completion, and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bar" className="pb-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="bar">
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={coursePerformanceData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} />
                        <XAxis dataKey="name" stroke={colors.text} />
                        <YAxis stroke={colors.text} />
                        <ChartTooltip content={(props) => <CustomTooltip {...props} theme={theme} />} />
                        <Legend />
                        <Bar dataKey="enrollments" fill={colors.chartColors.primary[0]} barSize={20} />
                        <Bar dataKey="completionRate" fill={colors.chartColors.primary[1]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="line">
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={coursePerformanceData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} />
                        <XAxis dataKey="name" stroke={colors.text} />
                        <YAxis stroke={colors.text} />
                        <ChartTooltip content={(props) => <CustomTooltip {...props} theme={theme} />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="enrollments" 
                          stroke={colors.chartColors.primary[0]} 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="completionRate" 
                          stroke={colors.chartColors.primary[1]} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// UI Tooltip component
function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <TooltipComponent>
      {children}
    </TooltipComponent>
  );
}