"use client";

import { useState } from "react";
import { Blog, useBlogs } from "@/hooks/use-blogs";
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
import { ViewBlogModal } from "@/components/admin/view-blog-modal";
import { EditBlogModal } from "@/components/admin/edit-blog-modal";
import "react-quill/dist/quill.snow.css";

export default function BlogsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useBlogs(page);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

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
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString();
      },
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
              <DropdownMenuItem onClick={() => setViewBlog(blog)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditBlog(blog)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading blogs</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Blogs</h1>
      <div className="mb-4">
        <Link href="/admin/blogs/create">
          <Button>Create New Blog</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data!.blogs} />
      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={data!.blogs.length < 10}
        >
          Next
        </Button>
      </div>
      {viewBlog && (
        <ViewBlogModal blog={viewBlog} onClose={() => setViewBlog(null)} />
      )}
      {editBlog && (
        <EditBlogModal blog={editBlog} onClose={() => setEditBlog(null)} />
      )}
    </div>
  );
}
