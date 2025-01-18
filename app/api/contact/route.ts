import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getContactFormEmailTemplate } from "@/lib/email-templates/contact-submission";
import { sendEmail } from "@/lib/email";

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

    const emailHtml = getContactFormEmailTemplate({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
    });

    const adminUser = await db.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (adminUser) {
      await sendEmail({
        to: adminUser.email,
        subject:
          "New Contact Form Submission - African Centre For Career Mentorship",
        html: emailHtml,
        text: `New contact form submission from ${body.name} <${body.email}>`,
      });
    } else {
      console.error("Admin user not found");
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 500 }
      );
    }

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
