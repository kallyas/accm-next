"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lock, Loader2 } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  order: number;
}

interface LessonNavigationProps {
  lessons: Lesson[];
  currentLessonId: string;
  completedLessons: { lessonId: string }[];
  courseId: string;
}

export function LessonNavigation({
  lessons,
  currentLessonId,
  completedLessons,
  courseId,
}: LessonNavigationProps) {
  const router = useRouter();
  const completedLessonIds = new Set(completedLessons.map((cl) => cl.lessonId));

  const handleLessonClick = useCallback(
    (lessonId: string, isLocked: boolean) => {
      if (isLocked) return;
      router.push(`/courses/${courseId}/learn?lesson=${lessonId}`);
    },
    [courseId, router]
  );

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
                  className="w-full justify-start group relative"
                  onClick={() => handleLessonClick(lesson.id, isLocked)}
                  disabled={isLocked}
                >
                  <div className="flex items-center w-full">
                    {isCompleted && (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    {isLocked && (
                      <Lock className="mr-2 h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </div>
                  {isCurrent && (
                    <div className="absolute left-0 w-1 h-full bg-primary rounded-full" />
                  )}
                </Button>
                {isLocked && (
                  <div className="text-xs text-muted-foreground mt-1 ml-2">
                    Complete previous lesson to unlock
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
