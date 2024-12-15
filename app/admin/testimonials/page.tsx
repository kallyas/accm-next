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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Testimonial = {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
};

const columns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content = row.getValue("content") as string;
      return <div className="max-w-[300px] truncate">{content}</div>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const testimonial = row.original;

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
              onClick={() => navigator.clipboard.writeText(testimonial.id)}
            >
              Copy testimonial ID
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>View full testimonial</DropdownMenuItem>
            <DropdownMenuItem>Edit testimonial</DropdownMenuItem>
            <DropdownMenuItem>Remove testimonial</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const data: Testimonial[] = [
  {
    id: "1",
    author: "Sarah M.",
    content:
      "The mentorship program has been transformative for my career. I highly recommend it to anyone looking to grow professionally.",
    rating: 5,
    date: "2023-05-15",
  },
  {
    id: "2",
    author: "Michael L.",
    content:
      "The resources and guidance provided by Pearl Mentor Hub have been invaluable. It's made a significant impact on my professional development.",
    rating: 4,
    date: "2023-06-02",
  },
  // Add more sample data as needed
];

export default function TestimonialsPage() {
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Testimonials</h1>
      <div className="mb-4">
        <Button>Add New Testimonial</Button>
      </div>
      <DataTable columns={columns} data={data} />
      {selectedTestimonial && (
        <Dialog
          open={!!selectedTestimonial}
          onOpenChange={() => setSelectedTestimonial(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Testimonial Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-semibold">Author</h3>
                <p>{selectedTestimonial.author}</p>
              </div>
              <div>
                <h3 className="font-semibold">Content</h3>
                <p>{selectedTestimonial.content}</p>
              </div>
              <div>
                <h3 className="font-semibold">Rating</h3>
                <p>{selectedTestimonial.rating} / 5</p>
              </div>
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>{selectedTestimonial.date}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
