import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: session!.user!.id,
      },
      include: {
        course: {
          select: {
            title: true,
            lessons: {
              select: {
                id: true,
              },
            },
          },
        },
        completedLessons: {
          select: {
            lessonId: true,
          },
        },
      },
    });

    const progress = enrollments.map((enrollment) => ({
      courseId: enrollment.courseId,
      courseTitle: enrollment.course.title,
      progress: Math.round(
        (enrollment.completedLessons.length /
          enrollment.course.lessons.length) *
          100
      ),
      completedLessons: enrollment.completedLessons.length,
      totalLessons: enrollment.course.lessons.length,
    }));

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
