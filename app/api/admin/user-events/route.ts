import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const userEvents = await db.event.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(userEvents);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
