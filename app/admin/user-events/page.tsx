"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

async function getUserEvents() {
  const response = await fetch("/api/admin/user-events");
  if (!response.ok) {
    throw new Error("Failed to fetch user events");
  }
  return response.json();
}

export default function UserEventsPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["userEvents"],
    queryFn: getUserEvents,
  });

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "eventName",
      header: "Event Name",
    },
    {
      accessorKey: "eventDate",
      header: "Event Date",
    },
  ];

  const handleExport = () => {
    if (data) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "User Events");
      XLSX.writeFile(workbook, "user_events.xlsx");
    }
  };

  const handleSendReminders = async () => {
    try {
      const response = await fetch("/api/admin/send-reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (response.ok) {
        toast({
          title: "Reminders Sent",
          description: "Email reminders have been sent to the selected users.",
        });
      } else {
        throw new Error("Failed to send reminders");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminders. Please try again." + error,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Event Registrations</h1>
      <div className="mb-4 flex justify-between">
        <Button onClick={handleExport}>Export to Excel</Button>
        <Button
          onClick={handleSendReminders}
          disabled={selectedUsers.length === 0}
        >
          Send Reminders to Selected Users
        </Button>
      </div>
      {data && (
        <DataTable
          columns={columns}
          data={data}
          onRowsSelected={(rows) =>
            setSelectedUsers(rows.map((row) => row.id.toString()))
          }
        />
      )}
    </div>
  );
}
