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

    const blogs = await db.blogPost.findMany({
      skip: from,
      take: to - from + 1,
      orderBy: { createdAt: "desc" },
    });

    const total = await db.blogPost.count();

    return NextResponse.json({
      blogs,
      pageInfo: {
        page: Number(page) || 0,
        pageSize: to - from + 1,
        total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const createBlogSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(50),
  author: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, author } = createBlogSchema.parse(body);

    const blog = await db.blogPost.create({
      data: {
        title,
        content,
        author,
      },
    });

    return NextResponse.json({ blog });
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
