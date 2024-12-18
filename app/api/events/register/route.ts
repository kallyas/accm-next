import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  eventId: z.string(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const body = registerSchema.parse(json);

    const registration = await db.userEvent.create({
      data: {
        userId: session!.user!.id,
        eventId: body.eventId,
      },
    });

    // Create a notification for the user
    await db.notification.create({
      data: {
        userId: session!.user!.id,
        title: "Event Registration Successful",
        content: "You have successfully registered for the event.",
      },
    });

    // Create a notification for the admin (assuming admin has id "admin-id")
    await db.notification.create({
      data: {
        userId: "admin-id", // Replace with actual admin user id
        title: "New Event Registration",
        content: `User ${session!.user!.email} has registered for an event.`,
      },
    });

    return NextResponse.json(registration);
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
