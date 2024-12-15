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
import Link from "next/link";

export function UserDashboard() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Dashboard"
        text="Track your progress and manage your mentorship journey."
      >
        <Link href="/book-session">
          <Button>Book a Session</Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>
              Your scheduled mentorship sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Next session: July 15, 2023 at 2:00 PM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Your career development progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Completed modules: 4/10</p>
            <p>Skills improved: Communication, Leadership</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Access learning materials</CardDescription>
          </CardHeader>
          <CardContent>
            <p>New recommended resource: "Effective Networking Strategies"</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
