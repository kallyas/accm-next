import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Award, Users } from "lucide-react";
import { EnrollButton } from "@/components/enroll-button";
import { LessonList } from "@/components/lesson-list";

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      lessons: true,
      enrollments: {
        where: { userId: session!.user!.id },
        include: { completedLessons: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const enrollment = course.enrollments[0];

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">{course.title}</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>{course.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{course.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{course.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{course._count.enrollments} enrolled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Lessons</h2>
          <LessonList
            lessons={course.lessons}
            courseId={course.id}
            enrollment={enrollment}
          />
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollment ? (
                <>
                  <Progress value={enrollment.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {enrollment.progress}% Complete
                  </p>
                  {enrollment.completedAt && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Completed on{" "}
                      {new Date(enrollment.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enroll to track your progress
                </p>
              )}
            </CardContent>
          </Card>

          {!enrollment ? (
            <EnrollButton courseId={course.id} />
          ) : (
            <Button className="w-full" disabled>
              Enrolled
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
