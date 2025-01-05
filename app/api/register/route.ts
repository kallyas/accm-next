import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { getAccountCreationEmailTemplate } from "@/lib/email-templates/account-creation";

// Comprehensive validation schema
const UserRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  service: z.string().trim().min(1, "Service is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Invalid gender selection" }),
  }),
  country: z.string().trim().min(2, "Country is required"),
  educationLevel: z.enum(
    ["HIGH_SCHOOL", "BACHELORS", "MASTERS", "DOCTORATE", "OTHER", "PHD"],
    {
      errorMap: () => ({ message: "Invalid education level" }),
    }
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validationResult = UserRegistrationSchema.safeParse({
      ...body,
      educationLevel: body.educationLevel.toUpperCase(),
    });

    // Check validation results
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      service,
      gender,
      country,
      educationLevel,
    } = validationResult.data;

    // Check for existing user
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 } // Conflict status code
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        service,
        gender,
        country,
        educationLevel,
        firstName,
        lastName,
      },
      // Explicitly select fields to return
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    await sendEmail({
      to: email,
      subject: "Your account has been created",
      text: `Welcome to our platform, ${firstName}!`,
      html: getAccountCreationEmailTemplate({
        userName: `${firstName} ${lastName}`,
        loginUrl: `${process.env.VERCEL_URL}/login`,
      }),
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 } // Created status code
    );
  } catch (error) {
    // Log the full error (replace with proper logging)
    console.error("Registration error:", error);

    // Differentiate between different types of errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Registration failed",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected error during registration" },
      { status: 500 }
    );
  }
}

// Prevent caching of this dynamic route
export const dynamic = "force-dynamic";
