"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  company?: string;
  location?: string;
}

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
  autoplaySpeed?: number;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Graduate Student",
    content:
      "I had previously struggled with finding a good fit for a job when I realized my CV might be the problem. ACCM CV alignment service reshaped my presentation of who I am and what impact I have created and it taught me to apply this to other aspects of my career and not only my CV.",
    avatar: "/mentors/thumb.png",
    rating: 5,
    company: "Makerere University",
    location: "Kampala",
  },
  {
    id: 2,
    name: "John D.",
    role: "Marketing Manager",
    content:
      "African Center for Career Mentorship has truly been a game changer when it comes to my personal and professional development. The mentorship program provided clear direction and actionable steps that helped me advance in my career path within months.",
    avatar: "/mentors/thumb.png",
    rating: 5,
    company: "MTN Uganda",
    location: "Kampala",
  },
  {
    id: 3,
    name: "Emily K.",
    role: "Student",
    content:
      "Thank you to the team for always being responsive and available at a moment's notice to answer questions and inquiries. It was worth it! I encourage everyone to check out their catalog because there is a service for everyone from students to career professionals.",
    avatar: "/mentors/thumb.png",
    rating: 4,
    company: "Makerere University",
    location: "Kampala",
  },
  {
    id: 4,
    name: "David O.",
    role: "Software Engineer",
    content:
      "The scholarship quest service was exactly what I needed to find opportunities aligned with my career goals. Their guidance throughout the application process was invaluable, and I successfully secured funding for my master's program.",
    avatar: "/mentors/thumb.png",
    rating: 5,
    company: "Andela",
    location: "Kampala",
  },
];

export function TestimonialSlider({
  testimonials = defaultTestimonials,
  autoplaySpeed = 6000,
  className = "",
  showArrows = true,
  showDots = true,
}: TestimonialSliderProps): JSX.Element {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: autoplaySpeed, stopOnInteraction: false })]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const emblaApiRef = useRef<EmblaCarouselType | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApiRef.current = emblaApi;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => emblaApiRef.current?.scrollTo(index);
  const scrollPrev = () => emblaApiRef.current?.scrollPrev();
  const scrollNext = () => emblaApiRef.current?.scrollNext();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      className={cn("relative", className)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="min-w-0 flex-[0_0_100%] pr-4 md:flex-[0_0_82%] lg:flex-[0_0_74%]"
            >
              <article
                className={cn(
                  "h-full border bg-[#FFFFFF] p-6 transition-all ",
                  activeIndex === index
                    ? "border-[#1A1B4B]/20 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] "
                    : "border-[#1A1B4B]/20 opacity-70 "
                )}
              >
                <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start">
                  <div className="space-y-3">
                    <Avatar className="h-14 w-14 border border-[#1A1B4B]/20 ">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
                      {testimonial.rating}/5 rating
                    </div>
                  </div>

                  <div>
                    <div className="border-l-2 border-[#1A1B4B]/20 pl-3 ">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em]">
                        {testimonial.name}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#1A1B4B]/70 ">
                        {testimonial.role}
                        {testimonial.company ? ` · ${testimonial.company}` : ""}
                        {testimonial.location ? ` · ${testimonial.location}` : ""}
                      </p>
                    </div>

                    <blockquote className="mt-4 text-sm leading-7 text-[#1A1B4B] ">
                      “{testimonial.content}”
                    </blockquote>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {showDots ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2.5 transition-all",
                activeIndex === index
                  ? "w-10 bg-[#1A1B4B]/10 "
                  : "w-4 bg-[#1A1B4B]/10 hover:bg-[#1A1B4B]/10  "
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}

      {showArrows ? (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="inline-flex h-9 w-9 items-center justify-center border border-[#1A1B4B]/20 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10   "
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/200/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="inline-flex h-9 w-9 items-center justify-center border border-[#1A1B4B]/20 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10   "
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/200/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </motion.div>
  );
}
