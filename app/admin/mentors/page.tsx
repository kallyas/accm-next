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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Mentor = {
  id: string;
  name: string;
  expertise: string;
  rating: number;
  menteeCount: number;
};

const columns: ColumnDef<Mentor>[] = [
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
    accessorKey: "expertise",
    header: "Expertise",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "menteeCount",
    header: "Mentees",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const mentor = row.original;

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
              onClick={() => navigator.clipboard.writeText(mentor.id)}
            >
              Copy mentor ID
            </DropdownMenuItem>
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit mentor</DropdownMenuItem>
            <DropdownMenuItem>Remove mentor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const data: Mentor[] = [
  {
    id: "1",
    name: "Dr. Alice Johnson",
    expertise: "Career Development",
    rating: 4.8,
    menteeCount: 25,
  },
  {
    id: "2",
    name: "Prof. Robert Brown",
    expertise: "Academic Guidance",
    rating: 4.9,
    menteeCount: 30,
  },
  // Add more sample data as needed
];

export default function MentorsPage() {
  const [isNewMentorModalOpen, setIsNewMentorModalOpen] = useState(false);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Mentors</h1>
      <Dialog
        open={isNewMentorModalOpen}
        onOpenChange={setIsNewMentorModalOpen}
      >
        <DialogTrigger asChild>
          <Button>Add New Mentor</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Mentor</DialogTitle>
            <DialogDescription>
              Enter the details of the new mentor.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
              setIsNewMentorModalOpen(false);
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
                <Label htmlFor="expertise" className="text-right">
                  Expertise
                </Label>
                <Input id="expertise" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Textarea id="bio" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Mentor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
