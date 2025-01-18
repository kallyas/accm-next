import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const lessonSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  duration: z.number().min(1),
  order: z.number().min(1),
});

const learningObjectiveSchema = z.string().min(1);

const courseSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  duration: z.number().min(1),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  categoryId: z.string().cuid(),
  isFeatured: z.boolean(),
  previewVideoUrl: z.string().url().optional(),
  lessons: z.array(lessonSchema),
  learningObjectives: z.array(learningObjectiveSchema),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session!.user!.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await db.course.findMany({
    select: {
      id: true,
      title: true,
      level: true,
      duration: true,
      createdAt: true,
    },
  });

  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session!.user!.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const body = courseSchema.parse(json);

    const course = await db.course.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        content: body.content,
        duration: body.duration,
        level: body.level,
        categoryId: body.categoryId,
        isFeatured: body.isFeatured,
        previewVideoUrl: body.previewVideoUrl,
        lessons: {
          create: body.lessons.map((lesson) => ({
            title: lesson.title,
            content: lesson.content,
            duration: lesson.duration,
            order: lesson.order,
          })),
        },
        learningObjectives: {
          create: body.learningObjectives.map((objective) => ({
            content: objective,
          })),
        },
      },
      include: {
        lessons: true,
        learningObjectives: true,
      },
    });

    return NextResponse.json(course);
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
