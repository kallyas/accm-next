import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
})

const importUsersSchema = z.array(userSchema)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user!.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const users = importUsersSchema.parse(json)

    const createdUsers = await Promise.all(users.map(async (user) => {
      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      })

      if (existingUser) {
        return existingUser
      }

      const hashedPassword = await bcrypt.hash('defaultPassword', 10) // You may want to generate random passwords or handle this differently

      return db.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      })
    }))

    return NextResponse.json({ message: `${createdUsers.length} users imported successfully` })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error importing users:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

