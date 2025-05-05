import { Metadata } from "next";
import { SubscriptionsTable } from "@/components/admin/subscriptions-table";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download,
  Filter,
  RefreshCcw,
  CreditCard,
  Clock,
  CheckCircle,
  Ban,
  SearchIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

export const metadata: Metadata = {
  title: "Subscription Management",
  description: "View and manage user subscriptions across all plans",
};

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

// Statistic card component
function StatisticCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  variant = "default" 
}: { 
  title: string;
  value: string | number;
  description: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    success: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
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
          {trend && (
            <span className={`ml-2 font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SubscriptionsPageSkeleton />}>
        {/* Header with Title and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
            <p className="text-muted-foreground">
              View and manage user subscription payments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              New Subscription
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatisticCard 
            title="Total Subscriptions"
            value="452"
            description="All-time subscriptions"
            icon={CreditCard}
            variant="default"
          />
          <StatisticCard 
            title="Active Subscriptions"
            value="328"
            description="72.6% of total"
            icon={CheckCircle}
            variant="success"
            trend={{ value: 3.2, isPositive: true }}
          />
          <StatisticCard 
            title="Pending Approvals"
            value="24"
            description="Requires review"
            icon={Clock}
            variant="warning"
          />
          <StatisticCard 
            title="Rejected/Cancelled"
            value="100"
            description="22.1% of total"
            icon={Ban}
            variant="danger"
            trend={{ value: 1.5, isPositive: false }}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8 max-w-sm"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 rows</SelectItem>
                <SelectItem value="20">20 rows</SelectItem>
                <SelectItem value="30">30 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
                <SelectItem value="100">100 rows</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* These would be implemented similarly to the "all" tab above */}
          <TabsContent value="active" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <SubscriptionsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  );
}