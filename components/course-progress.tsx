import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Enrollment = {
  progress: number;
  completedLessons: { lessonId: string }[];
};

type CourseProgressProps = {
  enrollment: Enrollment;
  totalLessons: number;
};

export function CourseProgress({
  enrollment,
  totalLessons,
}: CourseProgressProps) {
  const completedLessons = enrollment.completedLessons.length;
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Course Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progressPercentage} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {completedLessons} of {totalLessons} lessons completed (
          {progressPercentage}%)
        </p>
      </CardContent>
    </Card>
  );
}
