import { Metadata } from "next";
import { SubscriptionsTable } from "@/components/admin/subscriptions-table";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw, CreditCard, Clock, CheckCircle, Ban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Subscription Management",
  description: "View and manage user subscriptions across all plans",
};

// Fetch subscription statistics from subscriptions data
async function fetchSubscriptionStats() {
  const response = await fetch("/api/admin/subscriptions");
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  const subscriptions = await response.json();

  // Calculate stats from the data
  const total = subscriptions.length;
  const active = subscriptions.filter((s: any) => s.status === "ACTIVE").length;
  const pending = subscriptions.filter(
    (s: any) => s.status === "PENDING"
  ).length;
  const cancelled = subscriptions.filter(
    (s: any) => s.status === "CANCELLED"
  ).length;

  return {
    total,
    active,
    pending,
    cancelled,
  };
}

// Loading skeleton for statistics cards
function StatisticsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-3 w-40 mt-2" />
      </CardContent>
    </Card>
  );
}

// Loading skeleton for the page
function SubscriptionsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatisticsCardSkeleton key={i} />
        ))}
      </div>

      <Skeleton className="h-12 w-full" />

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Statistic card component with real data
function StatisticCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    success:
      "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`p-2 rounded-full ${variantStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 flex items-center">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}

// Statistics component
function SubscriptionStatistics() {
  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: fetchSubscriptionStats,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatisticsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Subscriptions"
          value="0"
          description="All-time subscriptions"
          icon={CreditCard}
          variant="default"
        />
        <StatisticCard
          title="Active Subscriptions"
          value="0"
          description="0% of total"
          icon={CheckCircle}
          variant="success"
        />
        <StatisticCard
          title="Pending Approvals"
          value="0"
          description="Requires review"
          icon={Clock}
          variant="warning"
        />
        <StatisticCard
          title="Cancelled"
          value="0"
          description="0% of total"
          icon={Ban}
          variant="danger"
        />
      </div>
    );
  }

  const totalSubscriptions = stats.total || 0;
  const activeSubscriptions = stats.active || 0;
  const pendingSubscriptions = stats.pending || 0;
  const cancelledSubscriptions = stats.cancelled || 0;

  const activePercentage =
    totalSubscriptions > 0
      ? ((activeSubscriptions / totalSubscriptions) * 100).toFixed(1)
      : "0";

  const cancelledPercentage =
    totalSubscriptions > 0
      ? ((cancelledSubscriptions / totalSubscriptions) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        title="Total Subscriptions"
        value={totalSubscriptions}
        description="All-time subscriptions"
        icon={CreditCard}
        variant="default"
      />
      <StatisticCard
        title="Active Subscriptions"
        value={activeSubscriptions}
        description={`${activePercentage}% of total`}
        icon={CheckCircle}
        variant="success"
      />
      <StatisticCard
        title="Pending Approvals"
        value={pendingSubscriptions}
        description="Requires review"
        icon={Clock}
        variant="warning"
      />
      <StatisticCard
        title="Cancelled"
        value={cancelledSubscriptions}
        description={`${cancelledPercentage}% of total`}
        icon={Ban}
        variant="danger"
      />
    </div>
  );
}

export default function SubscriptionsPage() {
  const { refetch: refetchStats } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: fetchSubscriptionStats,
  });

  const handleRefresh = () => {
    refetchStats();
    // This will also trigger a refetch of the subscriptions table
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Suspense fallback={<SubscriptionsPageSkeleton />}>
        {/* Header with Title and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Subscription Management
            </h1>
            <p className="text-muted-foreground">
              View and manage user subscription payments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <SubscriptionStatistics />

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable statusFilter={null} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable statusFilter="ACTIVE" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable statusFilter="PENDING" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable statusFilter="CANCELLED" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  );
}
