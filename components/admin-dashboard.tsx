import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminDashboard() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Dashboard"
        text="Manage users, content, and platform settings."
      >
        <Button>Add New User</Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Active users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5,231</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Registrations</CardTitle>
            <CardDescription>Users registered this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">423</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Mentorships</CardTitle>
            <CardDescription>Ongoing mentorship relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,052</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Total revenue this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$12,543</p>
          </CardContent>
        </Card>
      </div>
      {/* Add more admin-specific components here */}
    </DashboardShell>
  );
}
