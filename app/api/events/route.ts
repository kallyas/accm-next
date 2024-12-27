import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  location: z.string().min(1, "Location is required"),
  bannerUrl: z.string().url().optional(),
});

export async function GET() {
  const events = await db.event.findMany({
    orderBy: { startDate: "asc" },
    include: { users: { select: { userId: true } } },
  });

  const formattedEvents = events.map((event) => ({
    ...event,
    registeredCount: event.users.length,
    users: undefined,
  }));

  return NextResponse.json(formattedEvents);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user!.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const body = eventSchema.parse(json);

    const event = await db.event.create({
      data: {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });

    return NextResponse.json(event);
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
