"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsDashboard } from "@/components/admin-dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  BarChart3, 
  CalendarDays, 
  CreditCard, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { ExtendedAnalyticsData } from "@/types/general";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Analytics data fetcher with date range support
async function fetchAnalytics(dateRange?: { start: string; end: string }): Promise<ExtendedAnalyticsData> {
  let url = "/api/admin/analytics";
  
  if (dateRange) {
    const params = new URLSearchParams({
      start: dateRange.start,
      end: dateRange.end
    });
    url = `${url}?${params.toString()}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }
  return response.json();
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Tabs Skeleton */}
      <Skeleton className="h-10 w-80" />
      
      {/* Quick Actions Skeleton */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-[300px] w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load dashboard</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{message}</p>
          <p className="text-sm">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="max-w-md p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">No analytics data available</h3>
            <p className="text-muted-foreground">
              Start getting insights once users begin interacting with your platform.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button>Add sample data</Button>
            <Button variant="outline">Learn more</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Quick action card component
function QuickActionCard({ 
  icon: Icon, 
  title, 
  value, 
  href 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  href: string;
}) {
  const router = useRouter();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => router.push(href)}>
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 text-white p-4 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 p-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetchAnalytics(),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error?.message || "Something went wrong"} />;
  }

  if (!data || Object.keys(data).length === 0) {
    return <EmptyState />;
  }

  // Current date formatting
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <Button className="self-start sm:self-auto">
          <TrendingUp className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Quick Actions */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <QuickActionCard 
              icon={Users} 
              title="New Users" 
              value={data.overview.newUserToday || 0} 
              href="/admin/users" 
            />
            <QuickActionCard 
              icon={CalendarDays} 
              title="Today's Events" 
              value={data.overview.todayEvents || 0} 
              href="/admin/events" 
            />
            <QuickActionCard 
              icon={CreditCard} 
              title="New Subscriptions" 
              value={data.overview.newSubscriptionsToday || 0} 
              href="/admin/subscriptions" 
            />
            <QuickActionCard 
              icon={BarChart3} 
              title="Course Enrollments" 
              value={data.overview.newEnrollmentsToday || 0} 
              href="/admin/courses" 
            />
          </div>
          
          {/* Analytics Dashboard */}
          <AnalyticsDashboard _data={data} />
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="px-0 min-h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">User analytics dashboard will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent className="px-0 min-h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Content analytics dashboard will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent className="px-0 min-h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Revenue analytics dashboard will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}