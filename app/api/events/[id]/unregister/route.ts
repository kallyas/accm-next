import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";

interface ApiError {
  error: string;
  code?: string;
}

interface ApiSuccess {
  success: true;
  message: string;
}

class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

const ParamsSchema = z.object({
  id: z.string()
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiSuccess | ApiError>> {
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new ApiRequestError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const validatedParams = ParamsSchema.safeParse(params);
    if (!validatedParams.success) {
      throw new ApiRequestError("Invalid event ID", 400, "INVALID_EVENT_ID");
    }

    // First check if the event exists and if the user is registered
    const event = await db.event.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        users: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!event) {
      throw new ApiRequestError("Event not found", 404, "EVENT_NOT_FOUND");
    }

    if (event.users.length === 0) {
      throw new ApiRequestError(
        "You are not registered for this event",
        400,
        "NOT_REGISTERED"
      );
    }

    // Delete the registration using the composite primary key
    await db.userEvent.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unregistered from the event",
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error: "Registration not found",
            code: "REGISTRATION_NOT_FOUND",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: "Database operation failed",
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.error("Unhandled error in unregister event route:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
