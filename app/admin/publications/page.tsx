"use client";

import { useState } from "react";
import {
  usePublications,
  useCreatePublication,
  useUpdatePublication,
  useDeletePublication,
} from "@/hooks/use-publications";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Publication } from "@/types/publication";

export default function PublicationsPage() {
  const { data: publications, isLoading, error } = usePublications();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] =
    useState<Publication | null>(null);
  const createPublicationMutation = useCreatePublication();
  const updatePublicationMutation = useUpdatePublication();
  const deletePublicationMutation = useDeletePublication();

  const handleCreatePublication = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const publicationData = {
      title: formData.get("title") as string,
      authors: formData.get("authors") as string,
      abstract: formData.get("abstract") as string,
      externalUrl: formData.get("externalUrl") as string,
      publishedDate: formData.get("publishedDate") as string,
    };

    try {
      await createPublicationMutation.mutateAsync(publicationData);
      setIsAddDialogOpen(false);
      toast({
        title: "Publication created",
        description: "The new publication has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the publication. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePublication = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!editingPublication) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      ...editingPublication,
      title: formData.get("title") as string,
      authors: formData.get("authors") as string,
      abstract: formData.get("abstract") as string,
      externalUrl: formData.get("externalUrl") as string,
      publishedDate: formData.get("publishedDate") as string,
    };

    try {
      await updatePublicationMutation.mutateAsync(updatedData);
      setIsEditDialogOpen(false);
      setEditingPublication(null);
      toast({
        title: "Publication updated",
        description: "The publication has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the publication. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    try {
      await deletePublicationMutation.mutateAsync(id);
      toast({
        title: "Publication deleted",
        description: "The publication has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the publication. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Publication>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "authors",
      header: "Authors",
    },
    {
      accessorKey: "publishedDate",
      header: "Published Date",
      cell: ({ row }) =>
        new Date(row.getValue("publishedDate")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const publication = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingPublication(publication);
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeletePublication(publication.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return <div>Error loading publications: {error.message}</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Publications</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Publication
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={publications || []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Publication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePublication}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="authors" className="text-right">
                  Authors
                </label>
                <Input
                  id="authors"
                  name="authors"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="abstract" className="text-right">
                  Abstract
                </label>
                <Input
                  id="abstract"
                  name="abstract"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="externalUrl" className="text-right">
                  External URL
                </label>
                <Input
                  id="externalUrl"
                  name="externalUrl"
                  type="url"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="publishedDate" className="text-right">
                  Published Date
                </label>
                <Input
                  id="publishedDate"
                  name="publishedDate"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Publication</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePublication}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-title" className="text-right">
                  Title
                </label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingPublication?.title}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-authors" className="text-right">
                  Authors
                </label>
                <Input
                  id="edit-authors"
                  name="authors"
                  defaultValue={editingPublication?.authors}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-abstract" className="text-right">
                  Abstract
                </label>
                <Input
                  id="edit-abstract"
                  name="abstract"
                  defaultValue={editingPublication?.abstract}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-externalUrl" className="text-right">
                  External URL
                </label>
                <Input
                  id="edit-externalUrl"
                  name="externalUrl"
                  type="url"
                  defaultValue={editingPublication?.externalUrl}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-publishedDate" className="text-right">
                  Published Date
                </label>
                <Input
                  id="edit-publishedDate"
                  name="publishedDate"
                  type="date"
                  defaultValue={editingPublication?.publishedDate.split("T")[0]}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Publication</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
