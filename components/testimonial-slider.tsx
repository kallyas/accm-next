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
    role: "Client",
    content:
      "l had previously struggled with finding a good fit for a job when l realized my CV might be the problem. ACCM CV alignment service reshaped my presentation of who l am and what impact l have created and it taught me to apply this to other aspects of my career and not only my CV.",
    avatar: "/mentors/thumb.png",
  },
  {
    id: 2,
    name: "John D.",
    role: "Marketing Manager",
    content:
      "African Center for Career Mentorship has truly been a game changer when it comes to my personal and professional development. l had previously struggled with finding a good fit for a job when l realized my CV might be the problem. ACCM's CV alignment service reshaped my presentation of who I am and what impact l have created and it taught me to apply this to other aspects of my career and not only my CV.",
    avatar: "/mentors/thumb.png",
  },
  {
    id: 3,
    name: "Emily K.",
    role: "Student at Makerere University",
    content:
      "Thank you to the team for always being responsive and available at a moment's notice to answer questions and inquiries. it was worth it! l encourage everyone to check out their catalog because there is a service for everyone from students to career professionals.",
    avatar: "/mentors/thumb.png",
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
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id}>
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage
                    src={testimonial.avatar}
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
