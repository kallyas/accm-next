"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Base schema for plan data without ID
const basePlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(0, "Price must be non-negative"),
  duration: z.string().min(1, "Duration must be at least 1"),
  services: z.array(z.string()).min(1, "At least one service is required"),
  features: z.array(z.string()),
});

// Extended schema that includes ID for editing
const planWithIdSchema = basePlanSchema.extend({
  id: z.string(),
});

type BasePlan = z.infer<typeof basePlanSchema>;
type Plan = z.infer<typeof planWithIdSchema>;

interface PaginationData {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

interface PlansResponse {
  plans: Plan[];
  pagination: PaginationData;
}

const fetchPlans = async (
  page: number,
  pageSize: number
): Promise<PlansResponse> => {
  const response = await fetch(
    `/api/admin/plans?page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch plans");
  }
  return response.json();
};

export function PlansManager() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Create separate forms for add and edit
  const addForm = useForm<BasePlan>({
    resolver: zodResolver(basePlanSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      duration: "1",
      services: [],
      features: [],
    },
  });

  const editForm = useForm<Plan>({
    resolver: zodResolver(planWithIdSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: "0",
      duration: "1",
      services: [],
      features: [],
    },
  });

  const { data, isLoading, error } = useQuery<PlansResponse>({
    queryKey: ["plans", page, pageSize],
    queryFn: () => fetchPlans(page, pageSize),
  });

  const addPlanMutation = useMutation<Plan, Error, BasePlan>({
    mutationFn: async (plan: BasePlan): Promise<Plan> => {
      const response = await fetch("/api/admin/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      });
      if (!response.ok) {
        throw new Error("Failed to create plan");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({ title: "Plan created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error creating plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editPlanMutation = useMutation<Plan, Error, Plan>({
    mutationFn: async (plan: Plan): Promise<Plan> => {
      const response = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      });
      if (!response.ok) {
        throw new Error("Failed to update plan");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setIsEditDialogOpen(false);
      setEditingPlan(null);
      editForm.reset();
      toast({ title: "Plan updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error updating plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/admin/plans/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({ title: "Plan deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const columns: ColumnDef<Plan>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.getValue("price")}`,
    },
    { accessorKey: "duration", header: "Duration" },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => row.getValue("services").join(", "),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setEditingPlan(plan);
                setIsEditDialogOpen(true);
                editForm.reset(plan); // Reset form with the current plan data
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deletePlanMutation.mutate(plan.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Loading plans...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handlePageSizeChange = (size: number) => {
    if (page > 1 && data?.pagination.pageCount === 1) {
      setPage(1);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" />
        Add Plan
      </Button>
      <DataTable
        pageCount={data?.pagination.pageCount ?? 0}
        pageIndex={page}
        pageSize={pageSize}
        onPaginationChange={handlePageSizeChange}
        isLoading={isLoading}
        columns={columns}
        data={data?.plans ?? []}
      />

      {/* Add Plan Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) addForm.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit((data) =>
                addPlanMutation.mutate(data)
              )}
              className="space-y-4"
            >
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Months)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value.join(", ")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value.join(", ")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingPlan(null);
            editForm.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit((data) => {
                if (editingPlan) {
                  editPlanMutation.mutate({ ...data, id: editingPlan.id });
                }
              })}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Months)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value.join(", ")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value.join(", ")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
