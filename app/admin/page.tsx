import { AdminDashboard } from "@/components/admin-dashboard";
import { EmailUsers } from "@/components/admin/email-users";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      <AdminDashboard />
      <div>
        <h2 className="text-2xl font-bold mb-4">Email Users</h2>
        <EmailUsers />
      </div>
    </div>
  );
}
