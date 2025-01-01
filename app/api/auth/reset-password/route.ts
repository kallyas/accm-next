import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = resetPasswordSchema.parse(json);

    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token: body.token },
    });

    if (!passwordResetToken || passwordResetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await db.user.update({
      where: { id: passwordResetToken.userId },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: passwordResetToken.id },
    });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
