"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Software Developer",
    content:
      "The mentorship I received through Pearl Mentor Hub was instrumental in landing my dream job. The guidance and support were invaluable.",
  },
  {
    id: 2,
    name: "John D.",
    role: "Marketing Manager",
    content:
      "The workshops and resources provided by Pearl Mentor Hub helped me develop crucial leadership skills that propelled my career forward.",
  },
  {
    id: 3,
    name: "Emily K.",
    role: "Entrepreneur",
    content:
      "The network I built through Pearl Mentor Hub's community has been a game-changer for my startup. The connections and advice are priceless.",
  },
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="relative">
      <Card>
        <CardContent className="pt-6">
          <blockquote className="text-lg italic">
            "{testimonials[currentIndex].content}"
          </blockquote>
          <div className="mt-4">
            <p className="font-semibold">{testimonials[currentIndex].name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonials[currentIndex].role}
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4">
        <Button size="icon" variant="ghost" onClick={prevTestimonial}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4">
        <Button size="icon" variant="ghost" onClick={nextTestimonial}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
