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

type Resource = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  downloadCount: number;
};

const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "downloadCount",
    header: "Downloads",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const resource = row.original;

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
              onClick={() => navigator.clipboard.writeText(resource.id)}
            >
              Copy resource ID
            </DropdownMenuItem>
            <DropdownMenuItem>View resource</DropdownMenuItem>
            <DropdownMenuItem>Edit resource</DropdownMenuItem>
            <DropdownMenuItem>Delete resource</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const data: Resource[] = [
  {
    id: "1",
    title: "Career Development Guide",
    description: "A comprehensive guide for career growth",
    fileUrl: "/resources/career-guide.pdf",
    downloadCount: 1250,
  },
  {
    id: "2",
    title: "Interview Preparation Checklist",
    description: "Essential checklist for job interviews",
    fileUrl: "/resources/interview-checklist.pdf",
    downloadCount: 980,
  },
  // Add more sample data as needed
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Downloadable Resources</h1>
      <div className="mb-4">
        <Button>Add New Resource</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
