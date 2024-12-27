import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEvents = await db.event.findMany({
      where: {
        users: {
          some: {
            userId: session.user!.id,
          },
        },
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { startDate: "asc" },
    });

    const formattedEvents = userEvents.map((event) => ({
      ...event,
      registeredCount: event._count.users,
      _count: undefined,
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
