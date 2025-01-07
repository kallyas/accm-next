"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

type Testimonial = {
  id: string;
  content: string;
  author: string;
  rating: number;
  createdAt: string;
};

async function fetchTestimonials(): Promise<Testimonial[]> {
  const response = await fetch("/api/user/testimonials");
  if (!response.ok) {
    throw new Error("Failed to fetch testimonials");
  }
  return response.json();
}

export default function UserTestimonialsPage() {
  const {
    data: testimonials,
    isLoading,
    error,
    refetch,
  } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });
  const [isNewTestimonialModalOpen, setIsNewTestimonialModalOpen] =
    useState(false);

  const handleAddTestimonial = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);

    try {
      const response = await fetch("/api/user/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to add testimonial");
      }

      toast({
        title: "Testimonial Added",
        description: "Your testimonial has been successfully added.",
      });
      setIsNewTestimonialModalOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading testimonials...</div>;
  if (error)
    return <div>Error loading testimonials: {(error as Error).message}</div>;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Testimonials</h1>
      <div className="mb-4">
        <Dialog
          open={isNewTestimonialModalOpen}
          onOpenChange={setIsNewTestimonialModalOpen}
        >
          <DialogTrigger asChild>
            <Button>Add New Testimonial</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddTestimonial}>
              <DialogHeader>
                <DialogTitle>Add New Testimonial</DialogTitle>
                <DialogDescription>
                  Share your experience with Pearl Mentor Hub.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Testimonial</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <CardTitle>Testimonial</CardTitle>
              <CardDescription>
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{testimonial.content}</p>
              <p className="mt-2">Rating: {testimonial.rating} / 5</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
