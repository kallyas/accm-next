import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const NotificationQuerySchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Parse and validate query parameters
    const searchParams = req.nextUrl.searchParams;
    const userId = session?.user?.id;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Validate input
    const validationResult = NotificationQuerySchema.safeParse({ userId });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * pageSize;

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        where: { userId: userId! },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      db.notification.count({
        where: { userId: userId! },
      }),
    ]);
    // Return results
    return NextResponse.json({
      notifications,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    // Log error (replace with your actual logging mechanism)
    console.error("Error fetching notifications:", error);

    // Return a generic error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Disable caching for this dynamic route
export const dynamic = "force-dynamic";
