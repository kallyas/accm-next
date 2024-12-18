"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lock } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  order: number;
};

type LessonNavigationProps = {
  lessons: Lesson[];
  currentLessonId: string;
  completedLessons: { lessonId: string }[];
  courseId: string;
};

export function LessonNavigation({
  lessons,
  currentLessonId,
  completedLessons,
  courseId,
}: LessonNavigationProps) {
  const completedLessonIds = new Set(completedLessons.map((cl) => cl.lessonId));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            const isCurrent = lesson.id === currentLessonId;
            const isLocked =
              !isCompleted &&
              !isCurrent &&
              index > 0 &&
              !completedLessonIds.has(lessons[index - 1].id);

            return (
              <li key={lesson.id}>
                <Button
                  variant={isCurrent ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                  disabled={isLocked}
                >
                  <Link href={`/courses/${courseId}/learn?lesson=${lesson.id}`}>
                    {isCompleted && (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    )}
                    {isLocked && <Lock className="mr-2 h-4 w-4" />}
                    <span>{lesson.title}</span>
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
