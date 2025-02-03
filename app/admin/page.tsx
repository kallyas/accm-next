"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsDashboard } from "@/components/admin-dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BarChart3, TrendingDown } from "lucide-react";
import { ExtendedAnalyticsData } from "@/types/general";

async function fetchAnalytics(): Promise<ExtendedAnalyticsData> {
  const response = await fetch("/api/admin/analytics");
  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }
  return response.json();
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
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

      {/* Course Performance Skeleton */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Card>
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
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No analytics data available</h3>
          <p className="text-sm text-muted-foreground">
            Start getting insights once users begin interacting with your
            platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Monitor your platform performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
      <AnalyticsDashboard _data={data} />
    </div>
  );
}
