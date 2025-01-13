"use client";

import { useCallback } from "react";
import { UsersManager } from "@/components/admin/users-manager";
import { ImportModal } from "@/components/admin/import-modal";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const handleImportSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }, [queryClient]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground mt-2">
          View, edit, and manage user accounts.
        </p>
      </div>
      <div className="mb-6">
        <ImportModal onSuccess={handleImportSuccess} />
      </div>
      <UsersManager />
    </div>
  );
}
