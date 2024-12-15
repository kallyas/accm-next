"use client";

import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Testimonial = {
  id: string;
  content: string;
  rating: number;
  date: string;
};

export default function UserTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "1",
      content: "Great mentorship program!",
      rating: 5,
      date: "2023-06-15",
    },
    {
      id: "2",
      content: "Learned a lot from my mentor.",
      rating: 4,
      date: "2023-07-01",
    },
  ]);
  const [isNewTestimonialModalOpen, setIsNewTestimonialModalOpen] =
    useState(false);

  const handleAddTestimonial = (
    newTestimonial: Omit<Testimonial, "id" | "date">
  ) => {
    const testimonial: Testimonial = {
      ...newTestimonial,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    };
    setTestimonials([...testimonials, testimonial]);
    setIsNewTestimonialModalOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
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
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
              <DialogDescription>
                Share your experience with the mentorship program.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddTestimonial({
                  content: formData.get("content") as string,
                  rating: Number(formData.get("rating")),
                });
              }}
            >
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
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <CardTitle>Testimonial</CardTitle>
              <CardDescription>{testimonial.date}</CardDescription>
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
