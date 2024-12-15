import { UserDashboard } from "@/components/user-dashboard";
import { SubscribePlan } from "@/components/user/subscribe-plan";

export default function UserDashboardPage() {
  return (
    <div className="space-y-10">
      <UserDashboard />
      <SubscribePlan />
    </div>
  );
}
