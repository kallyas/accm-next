import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

