import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NotificationsList } from "@/components/notifications-list";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          Updates
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          Notifications
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          Track activity and stay on top of your mentorship journey.
        </p>
      </div>
      <NotificationsList userId={session?.user?.id} />
    </div>
  );
}
