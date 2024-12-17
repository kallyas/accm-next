"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Software Developer",
    content:
      "The mentorship I received through Pearl Mentor Hub was instrumental in landing my dream job. The guidance and support were invaluable.",
    avatar: "/avatars/sarah-m.jpg",
  },
  {
    id: 2,
    name: "John D.",
    role: "Marketing Manager",
    content:
      "The workshops and resources provided by Pearl Mentor Hub have been invaluable. It's made a significant impact on my professional development.",
    avatar: "/avatars/john-d.jpg",
  },
  {
    id: 3,
    name: "Emily K.",
    role: "Entrepreneur",
    content:
      "The network I built through Pearl Mentor Hub's community has been a game-changer for my startup. The connections and advice are priceless.",
    avatar: "/avatars/emily-k.jpg",
  },
];

export function TestimonialSlider() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-xl mx-auto"
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={testimonial.id}>
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage
                    src={`https://randomuser.me/api/portraits/${
                      index % 2 === 0 ? "men" : "women"
                    }/${index}.jpg`}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <blockquote className="text-lg italic mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
