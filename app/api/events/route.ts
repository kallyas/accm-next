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

    const events = await db.event.findMany({
      skip: from,
      take: to - from + 1,
      orderBy: { createdAt: "asc" },
    });

    const total = await db.event.count();

    return NextResponse.json({
      events,
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

const createEventSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  startDate: z.string().date(),
  endDate: z.string().date(),
  location: z.string().min(2),
  bannerUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, startDate, endDate, location, bannerUrl } =
      createEventSchema.parse(body);

    const event = await db.event.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        bannerUrl,
        location,
      },
    });

    return NextResponse.json({ event });
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
