import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import crypto from "crypto"
import { sendEmail } from "@/lib/email"
import { getForgotPasswordEmailTemplate } from "@/lib/email-templates/forgot-password"

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

    const resetUrl = `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/reset-password?token=${token}`
    const userName = user.firstName ? `${user.firstName} ${user.lastName}` : undefined

    await sendEmail({
      to: user.email,
      subject: "Reset Your Pearl Mentor Hub Password",
      text: `Click the following link to reset your password: https://${resetUrl}`,
      html: getForgotPasswordEmailTemplate({
        resetUrl,
        userName,
      }),
    })
    return NextResponse.json({ message: "If a user with that email exists, a password reset link has been sent." })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

