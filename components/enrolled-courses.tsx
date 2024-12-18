import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type EnrolledCourse = {
  id: string;
  title: string;
  description: string;
  progress: number;
};

export function EnrolledCourses({ courses }: { courses: EnrolledCourse[] }) {
  return (
    <div className="border-t border-b border-divider p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {courses.length === 0 && (
        <div className="flex flex-col items-center gap-4 p-6">
          <p className="text-muted-foreground">No courses enrolled</p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={course.progress} className="mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                {course.progress}% Complete
              </p>
              <Button asChild>
                <Link href={`/courses/${course.id}`}>
                  {course.progress === 100
                    ? "Review Course"
                    : "Continue Course"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
