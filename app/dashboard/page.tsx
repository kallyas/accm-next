import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserDashboard } from "@/components/user-dashboard";
import { SubscribePlan } from "@/components/user/subscribe-plan";
import { EnrolledCourses } from "@/components/enrolled-courses";


export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const enrolledCourses = await db.enrollment.findMany({
    where: { userId: session!.user!.id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
  });

  const formattedCourses = enrolledCourses.map((enrollment) => ({
    id: enrollment.course.id,
    title: enrollment.course.title,
    description: enrollment.course.description,
    progress: enrollment.progress,
  }));

  return (
    <div className="space-y-10">
      <UserDashboard />
      <EnrolledCourses courses={formattedCourses} />
      <SubscribePlan />
    </div>
  );
}
