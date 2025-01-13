"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { debounce } from "lodash";

const PAGE_SIZE = 10;

async function fetchUserEvents(page: number) {
  const response = await fetch(
    `/api/admin/user-events?page=${page}&limit=${PAGE_SIZE}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user events");
  }
  return response.json();
}

export default function UserEventsPage() {
  const [page, setPage] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userEvents", page],
    queryFn: () => fetchUserEvents(page + 1),
    staleTime: 30000,
  });

  const sendRemindersMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await fetch("/api/admin/send-reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });
      if (!response.ok) {
        throw new Error("Failed to send reminders");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reminders sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reminders",
        variant: "destructive",
      });
    },
  });

  const handleExport = useCallback(() => {
    if (!data?.data) return;

    const exportData = data.data.map((item) => ({
      Name: item.name || "N/A",
      Email: item.email,
      Event: item.eventName,
      "Event Date": new Date(item.eventDate).toLocaleDateString(),
      "Registration Date": new Date(item.registeredAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Events");
    XLSX.writeFile(workbook, "user_events.xlsx");
  }, [data]);

  const handleFilter = debounce((value: string) => {
    setFilterValue(value);
  }, 300);

  const handleSendReminders = () => {
    if (selectedUsers.length === 0) return;
    sendRemindersMutation.mutate(selectedUsers);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load user events"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Event Registrations</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all user event registrations
        </p>
      </div>

      <DataTableToolbar
        onFilter={handleFilter}
        onExport={handleExport}
        onSendReminders={handleSendReminders}
        selectedCount={selectedUsers.length}
        isLoading={isLoading}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pageCount={data?.pagination.totalPages ?? 0}
        pageIndex={page}
        pageSize={PAGE_SIZE}
        onPaginationChange={setPage}
        onRowSelectionChange={setSelectedUsers}
        filterValue={filterValue}
        isLoading={isLoading}
      />
    </div>
  );
}
