import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const level = searchParams.get("level");

  const skip = (page - 1) * pageSize;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category && { categoryId: category }),
    ...(level && { level }),
  };

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        level: true,
        category: { select: { name: true } },
      },
    }),
    db.course.count({ where }),
  ]);

  return NextResponse.json({
    courses,
    page,
    pageSize,
    total,
    hasNextPage: skip + courses.length < total,
  });
}
