import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.string().min(1, "Authors are required"),
  abstract: z.string().min(1, "Abstract is required"),
  externalUrl: z.string().url("Invalid URL"),
  publishedDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
});

export async function GET() {
  const publications = await db.publication.findMany({
    orderBy: { publishedDate: "desc" },
  });
  return NextResponse.json(publications);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session!.user!.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const body = publicationSchema.parse(json);

    const publication = await db.publication.create({
      data: {
        ...body,
        publishedDate: new Date(body.publishedDate),
      },
    });

    return NextResponse.json(publication);
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
