import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <SettingsForm user={session!.user} />
    </div>
  )
}

