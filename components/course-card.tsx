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
import { Clock, BookOpen } from "lucide-react";

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    level: string;
    duration: number;
  };
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.level}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>{course.duration} minutes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/courses/${course.id}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Start Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
