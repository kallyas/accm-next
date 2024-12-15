import { UsersManager } from "@/components/admin/users-manager"

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <UsersManager />
    </div>
  )
}

