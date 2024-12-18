"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <Accordion type="single" collapsible className="w-full">
      {lessons.map((lesson, index) => (
        <AccordionItem value={`lesson-${lesson.id}`} key={lesson.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                {completedLessons.has(lesson.id) ? (
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                ) : enrollment ? (
                  <PlayCircle className="mr-2 h-5 w-5 text-blue-500" />
                ) : (
                  <Lock className="mr-2 h-5 w-5 text-gray-500" />
                )}
                <span className="font-medium">
                  Lesson {index + 1}: {lesson.title}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-4">
                <p className="mb-4">{lesson.content.substring(0, 150)}...</p>
                {enrollment && !completedLessons.has(lesson.id) && (
                  <Button onClick={() => handleComplete(lesson.id)}>
                    Mark as Complete
                  </Button>
                )}
                {!enrollment && (
                  <p className="text-sm text-muted-foreground">
                    Enroll in the course to access this lesson
                  </p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
