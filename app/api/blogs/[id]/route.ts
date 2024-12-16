import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await db.blogPost.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, content, tags, excerpt } = updateBlogSchema.parse(body);

    const updatedBlog = await db.blogPost.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
        excerpt,
        tags: {
          set: tags,
        },
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
