import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import crypto from "crypto"
import { sendEmail } from "@/lib/email"

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = forgotPasswordSchema.parse(json)

    const user = await db.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({ message: "If a user with that email exists, a password reset link has been sent." })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    await db.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      text: `Click the following link to reset your password: ${resetUrl}`,
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the following link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    })

    return NextResponse.json({ message: "If a user with that email exists, a password reset link has been sent." })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

