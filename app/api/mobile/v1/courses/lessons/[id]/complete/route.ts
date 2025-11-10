import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  errorResponse,
  notFoundError,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    // Get lesson with course info
    const lesson = await db.lesson.findUnique({
      where: { id: params.id },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!lesson) {
      return notFoundError("Lesson");
    }

    // Get or create enrollment
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: authResult.id,
          courseId: lesson.courseId,
        },
      },
      include: {
        completedLessons: true,
      },
    });

    if (!enrollment) {
      return errorResponse(
        "Not enrolled in this course",
        "NOT_ENROLLED",
        400
      );
    }

    // Check if already completed
    const existingCompletion = await db.lessonCompletion.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: params.id,
        },
      },
    });

    if (existingCompletion) {
      return errorResponse(
        "Lesson already completed",
        "ALREADY_COMPLETED",
        400
      );
    }

    // Create completion
    await db.lessonCompletion.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: params.id,
      },
    });

    // Calculate new progress
    const totalLessons = lesson.course.lessons.length;
    const completedLessons = enrollment.completedLessons.length + 1;
    const newProgress = Math.round((completedLessons / totalLessons) * 100);

    // Update enrollment progress
    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: newProgress,
        ...(newProgress === 100 && { completedAt: new Date() }),
      },
      include: {
        course: true,
        completedLessons: {
          include: {
            lesson: true,
          },
        },
      },
    });

    return successResponse({
      enrollment: updatedEnrollment,
      message: "Lesson completed successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
