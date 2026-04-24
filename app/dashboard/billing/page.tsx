import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { CurrentPlan } from "@/components/billing/current-plan";
import { BillingOverview } from "@/components/billing/billing-overview";
import { UpgradeOptions } from "@/components/billing/upgrade-options";
import { Sparkles, ArrowLeft } from "lucide-react";

export default async function BillingPage() {
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
          Subscription
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          Billing & Plans
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          Manage your subscription and billing
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CurrentPlan plan={currentPlan} />
        <BillingOverview bills={bills} />
      </div>

      <UpgradeOptions />
    </div>
  );
}