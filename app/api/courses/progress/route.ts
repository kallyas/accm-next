import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const progressSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const body = progressSchema.parse(json);

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session!.user!.id,
          courseId: body.courseId,
        },
      },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
        completedLessons: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 400 }
      );
    }

    await db.lessonCompletion.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: body.lessonId,
      },
    });

    const totalLessons = enrollment.course.lessons.length;
    const completedLessons = enrollment.completedLessons.length + 1;
    const progress = Math.round((completedLessons / totalLessons) * 100);

    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        completedAt: progress === 100 ? new Date() : undefined,
      },
    });

    return NextResponse.json(updatedEnrollment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
