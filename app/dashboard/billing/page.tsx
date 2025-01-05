import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { BillingOverview } from "@/components/billing/billing-overview"
import { CurrentPlan } from "@/components/billing/current-plan"
import { UpgradeOptions } from "@/components/billing/upgrade-options"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  
  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: {
      subscriptions: {
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    //   bills: {
    //     orderBy: { date: 'desc' },
    //     take: 5,
    //   },
    },
  })

 
  const currentPlan = user?.subscriptions[0]?.plan
  const bills: never[] = []

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <BillingOverview bills={bills} />
        <CurrentPlan plan={currentPlan} />
      </div>
      <div className="mt-10">
        <UpgradeOptions currentPlan={currentPlan} />
      </div>
    </div>
  )
}

