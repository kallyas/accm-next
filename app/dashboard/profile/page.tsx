import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ProfileForm } from "@/components/profile-form"
import { AvatarUpload } from "@/components/avatar-upload"
import { db } from "@/lib/db"
import { getR2Url } from "@/lib/cloudflare-r2"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: { profile: true },
  })

  const userAvatar = await getR2Url(user?.profile?.avatar || "")

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Profile Picture</h2>
          <AvatarUpload user={user!!} userAvatar={userAvatar} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <ProfileForm user={user!!} />
        </div>
      </div>
    </div>
  )
}

