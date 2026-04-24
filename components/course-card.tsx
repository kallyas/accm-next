"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, BookOpen, BarChart, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { cn } from "@/lib/utils";

type CourseCardProps = {
  course: Course;
  index?: number;
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group",
        index % 3 === 1 ? "md:translate-y-8" : "",
        index % 3 === 2 ? "md:-translate-y-4" : ""
      )}
    >
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF]  ">
        <div className="relative aspect-[16/10] overflow-hidden">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A1B4B]/5 ">
              <div className="flex h-full items-center justify-center">
                <PlayCircle className="h-12 w-12 text-[#1A1B4B]/60 " />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B4B]/60 via-[#1A1B4B]/10 to-transparent" />
        </div>
        <div className="p-5">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
            {course.category?.name || "Course"}
          </p>
          <h3 className="mt-2 text-base font-semibold uppercase leading-tight">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="mt-1 text-sm leading-6 text-[#1A1B4B] ">
              {course.subtitle}
            </p>
          )}
          <p className="mt-3 text-sm leading-6 text-[#1A1B4B]  line-clamp-2">
            {course.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-[#1A1B4B]/20 pt-4 text-xs uppercase tracking-wider text-[#1A1B4B]/70 ">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {course.duration} min
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {course.level}
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart className="h-4 w-4" />
              {course.lessons?.length || 0} lessons
            </div>
          </div>
          <Link
            href={`/courses/${course.id}`}
            className="mt-5 flex h-10 w-full items-center justify-center border border-[#1A1B4B]/20 bg-[#FFFFFF] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10    "
          >
            View course
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}