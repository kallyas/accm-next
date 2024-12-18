"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  content: string;
  order: number;
};

type LessonContentProps = {
  lesson: Lesson;
  courseId: string;
  isCompleted: boolean;
};

export function LessonContent({
  lesson,
  courseId,
  isCompleted,
}: LessonContentProps) {
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const response = await fetch("/api/courses/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, lessonId: lesson.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      setCompleted(true);
      toast({
        title: "Lesson Completed",
        description: "Your progress has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Lesson {lesson.order}: {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </CardContent>
      <CardFooter>
        {completed ? (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2" />
            Lesson Completed
          </div>
        ) : (
          <Button onClick={handleComplete} disabled={completing}>
            {completing ? "Marking as Complete..." : "Mark as Complete"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
