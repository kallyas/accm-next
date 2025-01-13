"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquarePlus,
} from "lucide-react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Testimonial = {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
};

type PaginatedResponse = {
  data: {
    testimonials: Testimonial[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

// Form validation schema
const testimonialSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be at least 10 characters long")
    .max(1000, "Content must not exceed 1000 characters"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
});

// API functions
const api = {
  fetchTestimonials: async (
    page = 1,
    limit = 6
  ): Promise<PaginatedResponse> => {
    const response = await fetch(
      `/api/user/testimonials?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch testimonials");
    }
    return response.json();
  },

  addTestimonial: async (data: z.infer<typeof testimonialSchema>) => {
    const response = await fetch("/api/user/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to add testimonial");
    }
    return result;
  },
};

// Components
const EmptyState = ({ onAddClick }: { onAddClick: () => void }) => (
  <Card className="text-center p-8">
    <CardContent className="pt-6 px-8">
      <div className="flex justify-center mb-4">
        <MessageSquarePlus className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
      <p className="text-muted-foreground mb-6">
        Share your experience with us by adding your first testimonial.
      </p>
      <Button onClick={onAddClick}>Add Your First Testimonial</Button>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>Testimonial</span>
        <div className="flex items-center text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="ml-1 text-sm">{testimonial.rating}/5</span>
        </div>
      </CardTitle>
      <CardDescription>
        {new Date(testimonial.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="whitespace-pre-wrap text-sm">{testimonial.content}</p>
    </CardContent>
  </Card>
);

const AddTestimonialDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>Add New Testimonial</DialogTitle>
          <DialogDescription>
            Share your experience with Pearl Mentor Hub.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">Your Experience</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Share your thoughts about your experience..."
              className="min-h-[120px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="1"
              max="5"
              placeholder="Rate from 1-5"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Testimonial"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

// Main component
export default function UserTestimonialsPage() {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["testimonials", page],
    queryFn: () => api.fetchTestimonials(page),
  });

  const addTestimonialMutation = useMutation({
    mutationFn: api.addTestimonial,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your testimonial has been added successfully.",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const content = formData.get("content") as string;
      const rating = parseInt(formData.get("rating") as string);

      const validatedData = testimonialSchema.parse({ content, rating });
      await addTestimonialMutation.mutateAsync(validatedData);
      event.currentTarget.reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const showEmptyState = !isLoading && data?.data.testimonials.length === 0;
  const showPagination = (data?.data.pagination.totalPages ?? 0) > 1;

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Share and manage your feedback
          </p>
        </div>
        {!showEmptyState && (
          <Button asChild onClick={() => setIsDialogOpen(true)}>
            Add New Testimonial
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/3 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-4 bg-muted rounded w-4/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : showEmptyState ? (
        <EmptyState onAddClick={() => setIsDialogOpen(true)} />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.data.testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {showPagination && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data?.data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    Math.min(data?.data.pagination.totalPages ?? 1, p + 1)
                  )
                }
                disabled={page >= (data?.data.pagination.totalPages ?? 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      <AddTestimonialDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        isSubmitting={addTestimonialMutation.isPending}
      />
    </div>
  );
}
