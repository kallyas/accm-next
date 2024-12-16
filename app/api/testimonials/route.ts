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

    const testimonials = await db.testimonial.findMany({
      skip: from,
      take: to - from + 1,
      orderBy: { createdAt: "desc" },
    });

    const total = await db.testimonial.count();

    return NextResponse.json({
      testimonials,
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

const createTestimonialSchema = z.object({
  content: z.string().min(10),
  author: z.string().min(2),
  role: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, author, role } = createTestimonialSchema.parse(body);

    const testimonial = await db.testimonial.create({
      data: {
        content,
        author,
        role,
      },
    });

    return NextResponse.json({ testimonial });
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
