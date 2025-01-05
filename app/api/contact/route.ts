import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = contactFormSchema.parse(json);

    const submission = await db.contact.create({
      data: body,
    });

    // Here you would typically send an email notification
    // For now, we'll just log the submission
    

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to submit contact form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
