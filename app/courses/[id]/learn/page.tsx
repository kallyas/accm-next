import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { LessonContent } from "@/components/lesson-content";
import { CourseProgress } from "@/components/course-progress";
import { LessonNavigation } from "@/components/lesson-navigation";
import { Suspense } from "react";

interface PageProps {
  params: { id: string };
  searchParams: { lesson?: string };
}

export default async function LearnPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
      enrollments: {
        where: { userId: session!.user!.id },
        include: { completedLessons: true },
      },
    },
  });

  if (!course) notFound();
  const enrollment = course.enrollments[0];
  if (!enrollment) redirect(`/courses/${params.id}`);

  // Determine current lesson based on URL param or progress
  const currentLessonId =
    searchParams.lesson ||
    (enrollment.completedLessons.length > 0
      ? course.lessons[
          Math.min(
            enrollment.completedLessons.length,
            course.lessons.length - 1
          )
        ].id
      : course.lessons[0].id);

  const currentLesson = course.lessons.find(
    (lesson) => lesson.id === currentLessonId
  );
  if (!currentLesson) notFound();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading lesson...</div>}>
            <LessonContent
              key={currentLesson.id}
              lesson={currentLesson}
              courseId={course.id}
              isCompleted={enrollment.completedLessons.some(
                (cl) => cl.lessonId === currentLesson.id
              )}
            />
          </Suspense>
        </div>
        <div className="space-y-6">
          <CourseProgress
            key={`progress-${enrollment.completedLessons.length}`}
            enrollment={enrollment}
            totalLessons={course.lessons.length}
          />
          <LessonNavigation
            lessons={course.lessons}
            currentLessonId={currentLessonId}
            completedLessons={enrollment.completedLessons}
            courseId={course.id}
          />
        </div>
      </div>
    </div>
  );
}
