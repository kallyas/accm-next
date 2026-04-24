"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type EnrolledCourse = {
  id: string;
  title: string;
  description: string;
  progress: number;
  thumbnailUrl?: string;
};

function EnrolledCourseCard({
  course,
  index,
}: {
  course: EnrolledCourse;
  index: number;
}) {
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
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF]">
        <div className="relative aspect-[16/10] overflow-hidden">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A1B4B]/5">
              <div className="flex h-full items-center justify-center">
                <PlayCircle className="h-12 w-12 text-[#1A1B4B]/40" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B4B]/60 via-[#1A1B4B]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#1A1B4B]/15">
            <div
              className="h-full bg-[#26A649] transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-base font-semibold uppercase leading-tight">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#1A1B4B]/75">
            {course.description}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-[#1A1B4B]/15 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1B4B]/60">
              <BookOpen className="h-4 w-4" />
              {course.progress}% complete
            </div>
            <div className="flex items-center justify-center">
              <Progress value={course.progress} className="h-1.5 w-20" />
            </div>
          </div>
          <Link
            href={`/courses/${course.id}`}
            className="mt-5 flex h-10 w-full items-center justify-center border border-[#1A1B4B]/20 bg-[#FFFFFF] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10"
          >
            {course.progress === 100 ? "Review" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function EnrolledCourses({ courses }: { courses: EnrolledCourse[] }) {
  if (courses.length === 0) {
    return (
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF] p-12 text-center">
        <PlayCircle className="mx-auto h-12 w-12 text-[#1A1B4B]/35" />
        <h3 className="mt-4 text-lg font-semibold uppercase text-[#1A1B4B]">No courses yet</h3>
        <p className="mt-2 text-sm leading-6 text-[#1A1B4B]/70">
          You have not enrolled in any courses. Browse our catalog to start learning.
        </p>
        <Link href="/courses">
          <Button className="mt-6 h-10 rounded-none bg-[#1A1B4B] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#FFFFFF] hover:bg-[#1A1B4B]/90">
            Browse courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <EnrolledCourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  );
}
