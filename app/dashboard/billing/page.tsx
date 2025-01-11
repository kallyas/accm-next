import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { CurrentPlan } from "@/components/billing/current-plan";
import { BillingOverview } from "@/components/billing/billing-overview";
import { UpgradeOptions } from "@/components/billing/upgrade-options";

interface PageProps {
  searchParams: {
    message?: string;
    returnTo?: string;
  };
}

export default async function BillingPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: {
      subscriptions: {
        include: { plan: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const currentPlan = user?.subscriptions[0]?.plan;
  const bills: never[] = [];

  const message = searchParams.message
    ? decodeURIComponent(searchParams.message)
    : null;
  const returnTo = searchParams.returnTo
    ? decodeURIComponent(searchParams.returnTo)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
        {/* Alert Message */}
        {message && (
          <div className="mb-6">
            <Alert  className="alert-info alert-accented alert-animate-in relative border-l-4 border-blue-500">
              <Info className="h-5 w-5" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                {message}
                {returnTo && (
                  <div className="mt-2">
                    <Link
                      href={returnTo}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Return after completing payment
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Billing & Subscription
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your subscription, view billing history, and upgrade your plan
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Top Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <CurrentPlan plan={currentPlan} />
            <BillingOverview bills={bills} />
          </div>
          
          {/* Upgrade Options */}
          <UpgradeOptions />
        </div>
      </div>
    </div>
  );
}