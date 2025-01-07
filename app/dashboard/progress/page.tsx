"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, BookOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type CourseProgress = {
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
};

// Separate API function
async function fetchUserProgress(): Promise<CourseProgress[]> {
  const response = await fetch("/api/user/progress");
  if (!response.ok) {
    throw new Error("Failed to fetch user progress");
  }
  return response.json();
}

// Loading skeleton component
function ProgressSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/4 mt-2" />
      </CardContent>
    </Card>
  );
}

// Error state component
function ErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

// Empty state component
function EmptyState() {
  return (
    <Card className="col-span-full p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No Courses Found</h3>
          <p className="text-sm text-muted-foreground">
            You haven't enrolled in any courses yet. Start your learning journey
            today!
          </p>
        </div>
      </div>
    </Card>
  );
}

// Course progress card component
function CourseProgressCard({ course }: { course: CourseProgress }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1">{course.courseTitle}</CardTitle>
        <CardDescription>
          {course.completedLessons} of {course.totalLessons} lessons completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={course.progress} className="w-full" />
        <p className="mt-2 text-sm text-muted-foreground">
          {course.progress}% Complete
        </p>
      </CardContent>
    </Card>
  );
}

// Main page component
export default function UserProgressPage() {
  const {
    data: courseProgress,
    isLoading,
    error,
  } = useQuery<CourseProgress[]>({
    queryKey: ["userProgress"],
    queryFn: fetchUserProgress,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Progress</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ProgressSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Progress</h1>
        <ErrorState message={(error as Error).message} />
      </div>
    );
  }

  // Empty state
  if (!courseProgress?.length) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Progress</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EmptyState />
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Progress</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courseProgress.map((course) => (
          <CourseProgressCard key={course.courseId} course={course} />
        ))}
      </div>
    </div>
  );
}
