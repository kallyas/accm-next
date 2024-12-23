import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, BarChart } from "lucide-react";
import { Course } from "@/types/course";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {course.description}
        </p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="mr-2 h-4 w-4" />
          <span>{course.duration} minutes</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>{course.level}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BarChart className="mr-2 h-4 w-4" />
          <span>{course.category?.name}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
