import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          Preferences
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          Settings
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          Control your notification and account communication preferences.
        </p>
      </div>
      <SettingsForm user={session!.user} />
    </div>
  )
}
