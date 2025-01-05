import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NotificationsList } from "@/components/notifications-list";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);


  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationsList userId={session?.user?.id} />
    </div>
  );
}
