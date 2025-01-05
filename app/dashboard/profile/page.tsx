import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ProfileForm } from "@/components/profile-form"
import { db } from "@/lib/db"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  const user = await db.user.findUnique({
    where: { id: session?.user?.id },
    include: { profile: true },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <ProfileForm user={user} />
    </div>
  )
}

