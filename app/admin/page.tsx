"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsDashboard } from "@/components/admin-dashboard";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { ExtendedAnalyticsData } from "@/types/general";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

async function fetchAnalytics(): Promise<ExtendedAnalyticsData> {
  const response = await fetch("/api/admin/analytics");
  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }
  return response.json();
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  });

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <Alert
        variant="destructive"
        className=" alert alert-accented alert-error alert-animate-in alert-with-icon"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      {data && <AnalyticsDashboard _data={data} />}
    </div>
  );
}
