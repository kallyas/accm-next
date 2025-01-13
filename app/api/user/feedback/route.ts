import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Types
type ApiResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

// Validation schema
const feedbackSchema = z.object({
  content: z
    .string()
    .min(10, "Feedback must be at least 10 characters long")
    .max(1000, "Feedback must not exceed 1000 characters"),
});

// Error handling utility
const handleApiError = (error: unknown): NextResponse<ApiResponse<never>> => {
  console.error("API Error:", error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: error.errors[0].message,
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    },
    { status: 500 }
  );
};

// Authentication middleware
const withAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.id;
};

export async function GET(req: Request) {
  try {
    const userId = await withAuth();

    // Handle pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const feedback = await db.feedback.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await db.feedback.count({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      data: {
        feedback,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized access" } },
        { status: 401 }
      );
    }
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await withAuth();

    // Validate request body
    const body = await req.json();
    const validatedData = feedbackSchema.parse(body);

    // Check for duplicate feedback (optional, remove if not needed)
    const existingFeedback = await db.feedback.findFirst({
      where: {
        userId,
        content: validatedData.content,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        {
          error: {
            code: "DUPLICATE_FEEDBACK",
            message: "Similar feedback was already submitted recently",
          },
        },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await db.feedback.create({
      data: {
        content: validatedData.content,
        userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: feedback,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized access" } },
        { status: 401 }
      );
    }
    return handleApiError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await withAuth();

    const { searchParams } = new URL(req.url);
    const feedbackId = searchParams.get("id");

    if (!feedbackId) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMS",
            message: "Feedback ID is required",
          },
        },
        { status: 400 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validatedData = feedbackSchema.parse(body);

    // Check if feedback exists and belongs to user
    const existingFeedback = await db.feedback.findFirst({
      where: {
        id: feedbackId,
        userId,
      },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Feedback not found",
          },
        },
        { status: 404 }
      );
    }

    // Update feedback
    const updatedFeedback = await db.feedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        content: validatedData.content,
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: updatedFeedback,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized access" } },
        { status: 401 }
      );
    }
    return handleApiError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await withAuth();

    const { searchParams } = new URL(req.url);
    const feedbackId = searchParams.get("id");

    if (!feedbackId) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMS",
            message: "Feedback ID is required",
          },
        },
        { status: 400 }
      );
    }

    // Check if feedback exists and belongs to user
    const existingFeedback = await db.feedback.findFirst({
      where: {
        id: feedbackId,
        userId,
      },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Feedback not found",
          },
        },
        { status: 404 }
      );
    }

    // Delete feedback
    await db.feedback.delete({
      where: {
        id: feedbackId,
      },
    });

    return NextResponse.json({
      data: { success: true },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized access" } },
        { status: 401 }
      );
    }
    return handleApiError(error);
  }
}
