import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const lessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  duration: z.number().min(1),
  order: z.number().min(1),
})

const learningObjectiveSchema = z.string().min(1)

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
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session!.user!.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const course = await db.course.findUnique({
    where: { id: params.id },
    include: { lessons: true, learningObjectives: true },
  })

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  return NextResponse.json(course)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session!.user!.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const body = courseSchema.parse(json)

    const course = await db.course.update({
      where: { id: params.id },
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
          upsert: body.lessons.map((lesson) => ({
            where: { id: lesson.id || "" },
            update: {
              title: lesson.title,
              content: lesson.content,
              duration: lesson.duration,
              order: lesson.order,
            },
            create: {
              title: lesson.title,
              content: lesson.content,
              duration: lesson.duration,
              order: lesson.order,
            },
          })),
        },
        learningObjectives: {
          deleteMany: {},
          create: body.learningObjectives.map((objective) => ({
            content: objective,
          })),
        },
      },
      include: {
        lessons: true,
        learningObjectives: true,
      },
    })

    // Delete lessons that are not in the updated list
    const lessonIds = body.lessons.map((lesson) => lesson.id).filter(Boolean)
    await db.lesson.deleteMany({
      where: {
        courseId: params.id,
        id: {
          notIn: lessonIds as string[],
        },
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session!.user!.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await db.course.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

