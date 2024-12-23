import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const categories = await db.category.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session!.user!.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const body = categorySchema.parse(json);

    const category = await db.category.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(category);
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
