import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { getAccountCreationEmailTemplate } from "@/lib/email-templates/account-creation";

const UserRegistrationSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  service: z.string().trim().optional(),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      errorMap: () => ({ message: "Invalid gender selection" }),
    })
    .optional(),
  country: z.string().trim().optional(),
  educationLevel: z
    .enum(["HIGH_SCHOOL", "BACHELORS", "MASTERS", "DOCTORATE", "OTHER", "PHD"], {
      errorMap: () => ({ message: "Invalid education level" }),
    })
    .optional(),
  acceptServiceAgreement: z.boolean().refine((val) => val === true, {
    message: "Service agreement must be accepted",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validationResult = UserRegistrationSchema.safeParse({
      ...body,
      email: typeof body.email === "string" ? body.email.toLowerCase().trim() : body.email,
      educationLevel:
        typeof body.educationLevel === "string"
          ? body.educationLevel.toUpperCase()
          : body.educationLevel,
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

    const { email, password, firstName, lastName, phone, service, gender, country, educationLevel } =
      validationResult.data;

    // Check for existing user
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
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
        phone: phone || null,
        service: service || null,
        gender: gender || null,
        country: country || null,
        educationLevel: educationLevel || null,
        firstName,
        lastName,
        acceptedServiceAgreement: true,
        serviceAgreementAcceptedAt: new Date(),
        serviceAgreementVersion: "1.0",
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

    let emailNotificationSent = true;

    try {
      const loginUrlBase = process.env.NEXTAUTH_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
      const loginUrl = loginUrlBase ? `${loginUrlBase.replace(/\/$/, "")}/login` : "/login";

      await sendEmail({
        to: email,
        subject: "Your account has been created",
        text: `Welcome to our platform, ${firstName}!`,
        html: getAccountCreationEmailTemplate({
          userName: `${firstName} ${lastName}`,
          loginUrl,
        }),
      });
    } catch (emailError) {
      emailNotificationSent = false;
      console.error("Account created but welcome email failed:", emailError);
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
        emailNotificationSent,
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
