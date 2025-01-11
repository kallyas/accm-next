import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@prisma/client";

interface UserDashboardContentProps {
  user: User;
}

export function UserDashboardContent({ user }: UserDashboardContentProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>Your profile completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">80%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Applications</CardTitle>
          <CardDescription>Total scholarships applied</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">5</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Scheduled mentoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">2</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress Status</CardTitle>
          <CardDescription>Your current stage</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{user.progressStatus}</p>
        </CardContent>
      </Card>
    </div>
  );
}
