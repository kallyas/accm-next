import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getPagination } from "@/lib/utils";

const querySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { page, pageSize } = querySchema.parse({
      page: url.searchParams.get("page"),
      pageSize: url.searchParams.get("pageSize"),
    });

    const { from, to } = getPagination(
      Number(page) || 0,
      Number(pageSize) || 10
    );

    const mentors = await db.mentor.findMany({
      skip: from,
      take: to - from + 1,
    });

    const total = await db.mentor.count();

    return NextResponse.json({
      mentors,
      pageInfo: {
        page: Number(page) || 0,
        pageSize: to - from + 1,
        total,
      },
    });
  } catch (_) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const createMentorSchema = z.object({
  name: z.string().min(2),
  bio: z.string().min(20),
  expertise: z.array(z.string()),
  avatar: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, bio, expertise, avatar } = createMentorSchema.parse(body);

    const mentor = await db.mentor.create({
      data: {
        name,
        bio,
        expertise,
        avatar,
      },
    });

    return NextResponse.json({ mentor });
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
