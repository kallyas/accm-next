import { Metadata } from "next";
import { SubscriptionsTable } from "@/components/admin/subscriptions-table";

export const metadata: Metadata = {
  title: "User Subscriptions",
  description: "Manage user subscriptions",
};

export default function UserSubscriptionsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Subscriptions</h1>
      <SubscriptionsTable />
    </div>
  );
}
