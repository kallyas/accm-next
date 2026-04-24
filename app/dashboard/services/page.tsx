import { UserServices } from "@/components/user/user-service"

export default function UserServicesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          Services
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          My Services
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          Explore the support services available in your mentorship plan.
        </p>
      </div>
      <UserServices />
    </div>
  )
}
