import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const enrollSchema = z.object({
  courseId: z.string(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const body = enrollSchema.parse(json);

    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session!.user!.id,
          courseId: body.courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId: session!.user!.id,
        courseId: body.courseId,
      },
    });

    return NextResponse.json(enrollment);
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
