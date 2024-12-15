"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  joinDate: string;
};

const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.id)}
            >
              Copy member ID
            </DropdownMenuItem>
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit member</DropdownMenuItem>
            <DropdownMenuItem>Remove member</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const data: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Senior Mentor",
    email: "john.doe@example.com",
    joinDate: "2022-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Career Coach",
    email: "jane.smith@example.com",
    joinDate: "2022-03-01",
  },
  // Add more sample data as needed
];

export default function TeamPage() {
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Team Members</h1>
      <Dialog
        open={isNewMemberModalOpen}
        onOpenChange={setIsNewMemberModalOpen}
      >
        <DialogTrigger asChild>
          <Button>Add New Team Member</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new team member.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
              setIsNewMemberModalOpen(false);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input id="role" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Team Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
