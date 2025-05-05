"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import {  EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Define TypeScript interfaces
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

// Default testimonials data
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
    location: "Kampala"
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
    location: "Kampala"
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
    location: "Kampala"
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
    location: "Kampala"
  },
];

export function TestimonialSlider({
  testimonials = defaultTestimonials,
  autoplaySpeed = 6000,
  className = "",
  showArrows = true,
  showDots = true
}: TestimonialSliderProps): React.ReactElement {
  const [_, EmblaCarouselType] = useEmblaCarousel();
  // Set up embla carousel with options
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      skipSnaps: false,
    }, 
    [Autoplay({ delay: autoplaySpeed, stopOnInteraction: false })]
  );
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Store the Embla API for callbacks
  const emblaApiRef = useRef<EmblaCarouselType | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApiRef.current = emblaApi;
    
    // Handle slide changes
    const onSelect = (): void => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    // Initial call to set the active index
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Function to scroll to a specific slide
  const scrollTo = (index: number): void => {
    if (emblaApiRef.current) {
      emblaApiRef.current.scrollTo(index);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className={cn("relative", className)}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 -z-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-60 blur-2xl" />
      <div className="absolute bottom-0 right-0 -z-10 w-20 h-20 bg-teal-100 dark:bg-teal-900/20 rounded-full opacity-60 blur-2xl" />
      
      <div className="relative max-w-4xl mx-auto">
        {/* Decorative quote marks */}
        <div className="absolute -top-12 right-20 text-8xl opacity-10 dark:opacity-5 font-serif">"</div>
        <div className="absolute -bottom-12 left-20 text-8xl opacity-10 dark:opacity-5 font-serif rotate-180">"</div>
        
        {/* Carousel container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="flex-[0_0_100%] min-w-0 pl-4 pr-4 md:flex-[0_0_75%] lg:flex-[0_0_66.666%]"
              >
                <div className="p-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex === index ? "active" : "inactive"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: activeIndex === index ? 1 : 0.3, 
                        y: activeIndex === index ? 0 : 10, 
                        scale: activeIndex === index ? 1 : 0.95 
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className={cn(
                        "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-blue-100 dark:border-blue-900/50 shadow-lg overflow-hidden",
                        activeIndex === index ? "scale-100" : "scale-95"
                      )}>
                        <CardContent className="flex flex-col items-center text-center p-8 relative">
                          {/* Quote mark decorations */}
                          <div className="absolute top-4 right-4 opacity-10">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.9091 6.36365C4.09091 9.27274 4.09091 19.0909 4.09091 19.0909H13V9.27274H10.9091C10.9091 9.27274 11.8182 6.36365 16 6.36365V3.45456C16 3.45456 12.7273 5.45456 10.9091 6.36365ZM25.9091 6.36365C19.0909 9.27274 19.0909 19.0909 19.0909 19.0909H28V9.27274H25.9091C25.9091 9.27274 26.8182 6.36365 31 6.36365V3.45456C31 3.45456 27.7273 5.45456 25.9091 6.36365Z" fill="currentColor"/>
                            </svg>
                          </div>
                          
                          {/* Avatar with gradient border */}
                          <div className="relative mb-4">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full blur-md opacity-60"></div>
                            <Avatar className="w-20 h-20 border-2 border-white dark:border-gray-800">
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
                          </div>
                          
                          {/* Star rating */}
                          <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${
                                  i < testimonial.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          
                          {/* Testimonial content */}
                          <blockquote className="text-lg md:text-xl italic mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                            "{testimonial.content}"
                          </blockquote>
                          
                          {/* Testimonial author */}
                          <div className="mt-auto">
                            <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {testimonial.role}
                              {testimonial.company && (
                                <span> · {testimonial.company}</span>
                              )}
                              {testimonial.location && (
                                <span> · {testimonial.location}</span>
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
          
        {/* Custom navigation dots */}
        {showDots && (
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-900"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Custom navigation arrows */}
        {showArrows && (
          <div className="hidden sm:block">
            <button 
              onClick={() => {
                if (emblaApiRef.current) emblaApiRef.current.scrollPrev();
              }}
              className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border border-blue-100 dark:border-blue-900/50 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (emblaApiRef.current) emblaApiRef.current.scrollNext();
              }}
              className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border border-blue-100 dark:border-blue-900/50 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}