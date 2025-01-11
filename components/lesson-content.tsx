"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface LessonContentProps {
  lesson: Lesson;
  courseId: string;
  isCompleted: boolean;
}

export function LessonContent({
  lesson,
  courseId,
  isCompleted: initialIsCompleted,
}: LessonContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [completing, setCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);

  const handleComplete = useCallback(async () => {
    if (completing || isCompleted) return;

    setCompleting(true);
    try {
      const response = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId: lesson.id }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      setIsCompleted(true);
      toast({
        title: "Lesson Completed",
        description: "Your progress has been updated.",
      });

      // Refresh the page data
      startTransition(() => {
        router.refresh();
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
  }, [completing, isCompleted, courseId, lesson.id, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Lesson {lesson.order}: {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </CardContent>
      <CardFooter>
        {isCompleted ? (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2" />
            Lesson Completed
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </div>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={completing || isPending}
            className="relative"
          >
            {(completing || isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {completing ? "Marking as Complete..." : "Mark as Complete"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
