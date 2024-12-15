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
import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  status: "draft" | "published";
};

const columns: ColumnDef<Blog>[] = [
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
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "publishDate",
    header: "Publish Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const blog = row.original;

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
              onClick={() => navigator.clipboard.writeText(blog.id)}
            >
              Copy blog ID
            </DropdownMenuItem>
            <DropdownMenuItem>View blog</DropdownMenuItem>
            <DropdownMenuItem>Edit blog</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const data: Blog[] = [
  {
    id: "1",
    title: "10 Tips for Career Success",
    author: "John Doe",
    publishDate: "2023-06-01",
    status: "published",
  },
  {
    id: "2",
    title: "The Future of Work",
    author: "Jane Smith",
    publishDate: "2023-06-15",
    status: "draft",
  },
  // Add more sample data as needed
];

export default function BlogsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Blogs</h1>
      <div className="mb-4">
        <Link href="/admin/blogs/create">
          <Button>Create New Blog</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
