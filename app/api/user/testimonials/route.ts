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

// Validation schemas
const testimonialSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  content: z.string().min(10).max(1000),
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
  if (!session?.user?.email) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.email;
};

export async function GET(req: Request) {
  try {
    const userEmail = await withAuth();

    // Fetch testimonials with pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const testimonials = await db.testimonial.findMany({
      where: {
        author: userEmail,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        content: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await db.testimonial.count({
      where: {
        author: userEmail,
      },
    });

    return NextResponse.json({
      data: {
        testimonials,
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
    const userEmail = await withAuth();

    // Validate request body
    const body = await req.json();
    let validatedData = testimonialSchema.parse(body);
    validatedData = {
      ...validatedData,
      rating: validatedData.rating ?? 0, // or any default value you prefer
    };

    // Check for duplicate testimonials
    const existingTestimonial = await db.testimonial.findFirst({
      where: {
        author: userEmail,
        content: validatedData.content,
      },
    });

    if (existingTestimonial) {
      return NextResponse.json(
        {
          error: {
            code: "DUPLICATE_TESTIMONIAL",
            message: "A similar testimonial already exists",
          },
        },
        { status: 400 }
      );
    }

    // Create testimonial
    const testimonial = await db.testimonial.create({
      data: {
        ...validatedData,
        author: userEmail,
      },
      select: {
        id: true,
        content: true,
        rating: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: testimonial,
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
    const userEmail = await withAuth();

    const { searchParams } = new URL(req.url);
    const testimonialId = searchParams.get("id");

    if (!testimonialId) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMS",
            message: "Testimonial ID is required",
          },
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await db.testimonial.findFirst({
      where: {
        id: testimonialId,
        author: userEmail,
      },
    });

    if (!testimonial) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Testimonial not found",
          },
        },
        { status: 404 }
      );
    }

    const updatedTestimonial = await db.testimonial.update({
      where: {
        id: testimonialId,
      },
      data: validatedData,
      select: {
        id: true,
        content: true,
        rating: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: updatedTestimonial,
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
    const userEmail = await withAuth();

    const { searchParams } = new URL(req.url);
    const testimonialId = searchParams.get("id");

    if (!testimonialId) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMS",
            message: "Testimonial ID is required",
          },
        },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.findFirst({
      where: {
        id: testimonialId,
        author: userEmail,
      },
    });

    if (!testimonial) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Testimonial not found",
          },
        },
        { status: 404 }
      );
    }

    await db.testimonial.delete({
      where: {
        id: testimonialId,
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
