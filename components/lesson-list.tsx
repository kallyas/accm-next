"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Lesson = {
  id: string;
  title: string;
  content: string;
  order: number;
};

type Enrollment = {
  id: string;
  progress: number;
  completedLessons: { lessonId: string }[];
} | null;

type LessonListProps = {
  lessons: Lesson[];
  courseId: string;
  enrollment: Enrollment;
};

export function LessonList({ lessons, courseId, enrollment }: LessonListProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(enrollment?.completedLessons.map((cl) => cl.lessonId) || [])
  );

  const handleComplete = async (lessonId: string) => {
    try {
      const response = await fetch("/api/courses/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, lessonId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      setCompletedLessons((prev) => new Set(prev).add(lessonId));
      toast({
        title: "Progress Updated",
        description: "Your progress has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Lesson {lesson.order}: {lesson.title}
              </span>
              {completedLessons.has(lesson.id) && (
                <CheckCircle className="text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{lesson.content.substring(0, 100)}...</p>
            {enrollment && !completedLessons.has(lesson.id) && (
              <Button onClick={() => handleComplete(lesson.id)}>
                Mark as Complete
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
