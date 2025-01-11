import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Award, Users, CheckCircle, User } from "lucide-react";
import { EnrollButton } from "@/components/enroll-button";
import { LessonList } from "@/components/lesson-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);


  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      lessons: true,
      enrollments: {
        where: { userId: session!.user!.id },
        include: { completedLessons: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const enrollment = course.enrollments[0];
  const isEnrolled = !!enrollment;

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            {course.description}
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{course.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{course._count.enrollments} enrolled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="syllabus" className="mb-8">
            <TabsList>
              <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>
            <TabsContent value="syllabus">
              <Card>
                <CardHeader>
                  <CardTitle>Course Syllabus</CardTitle>
                </CardHeader>
                <CardContent>
                  <LessonList
                    lessons={course.lessons}
                    courseId={course.id}
                    enrollment={enrollment}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">Dr. Jane Smith</h3>
                      <p className="text-sm text-muted-foreground">
                        Expert in {course.level} {course.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4">
                    Dr. Smith has over 10 years of experience in teaching and
                    researching in this field. She has published numerous papers
                    and is a recognized expert in the industry.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {isEnrolled ? (
                <>
                  <Progress value={enrollment.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {enrollment.progress}% Complete
                  </p>
                  <Button
                    disabled={enrollment.progress == 100}
                    className="w-full"
                    asChild
                  >
                    <Link href={`/courses/${course.id}/learn`}>
                      {enrollment.progress > 0
                        ? "Continue Learning"
                        : enrollment.progress == 100
                        ? "Review Course"
                        : "Start Learning"}
                    </Link>
                  </Button>
                  {enrollment.completedAt && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Completed on{" "}
                      {new Date(enrollment.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enroll to start learning
                  </p>
                  <EnrollButton courseId={course.id} />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>Basic understanding of programming concepts</li>
                <li>Familiarity with {course.title} fundamentals</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Master key concepts in " + course.title,
                  "Apply theoretical knowledge to real-world scenarios",
                  "Develop practical skills through hands-on exercises",
                  "Gain confidence in your abilities and knowledge",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
