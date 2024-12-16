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

    const resources = await db.downloadableResource.findMany({
      skip: from,
      take: to - from + 1,
      orderBy: { createdAt: "desc" },
    });

    const total = await db.downloadableResource.count();

    return NextResponse.json({
      resources,
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

const createResourceSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  fileUrl: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, fileUrl } = createResourceSchema.parse(body);

    const resource = await db.downloadableResource.create({
      data: {
        title,
        description,
        fileUrl,
      },
    });

    return NextResponse.json({ resource });
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
