import { PublicationsManager } from "@/components/admin/publications-manager"

export default function AdminPublicationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Publications</h1>
      <PublicationsManager />
    </div>
  )
}

