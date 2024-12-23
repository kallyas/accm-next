"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminDashboard } from "@/components/admin-dashboard";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

async function fetchDashboardData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {};
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-10">
      <AdminDashboard />
    </div>
  );
}
