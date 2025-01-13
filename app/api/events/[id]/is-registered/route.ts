import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Define response types
interface ApiError {
  error: string;
  code: string;
}

interface ApiSuccess {
  isRegistered: boolean;
  registrationDate?: Date; // Will be included if user is registered
}

// Validate request parameters
const ParamsSchema = z.object({
  id: z.string({
    message: "Invalid event ID format",
  }),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiSuccess | ApiError>> {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // Validate event ID
    const validatedParams = ParamsSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: "Invalid event ID",
          code: "INVALID_EVENT_ID",
        },
        { status: 400 }
      );
    }

    // Check if event exists and get registration status
    const registration = await db.userEvent.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Return registration status
    return NextResponse.json({
      isRegistered: !!registration,
      ...(registration && { registrationDate: registration.createdAt }),
    });
  } catch (error) {
    console.error("Error checking registration status:", error);

    return NextResponse.json(
      {
        error: "Failed to check registration status",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
