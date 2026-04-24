"use client";

import { useState } from "react";
import { useCoursesQuery } from "@/hooks/use-courses";
import { useDebounce } from "@/hooks/use-debounce";
import { CourseCard } from "@/components/course-card";
import { CourseFilters } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, RefreshCcw, Search } from "lucide-react";

type EmptyStateProps = {
  hasFilters: boolean;
  onClear: () => void;
};

function EmptyState({ hasFilters, onClear }: EmptyStateProps) {
  return (
    <div className="border border-gray-300 bg-white/70 p-8 text-center dark:border-gray-800 dark:bg-[#171b1d]">
      <BookOpen className="mx-auto h-10 w-10 text-gray-600 dark:text-gray-300" />
      <h3 className="mt-4 text-lg font-semibold uppercase tracking-[0.04em]">
        No courses found
      </h3>
      <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
        {hasFilters
          ? "Try adjusting your filters or search term."
          : "No courses have been created yet. Check back later or refresh the page."}
      </p>
      <div className="mt-5 flex justify-center">
        {hasFilters ? (
          <Button
            onClick={onClear}
            className="h-9 rounded-none bg-gray-900 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
            Clear filters
          </Button>
        ) : (
          <Button
            onClick={() => window.location.reload()}
            className="h-9 rounded-none bg-gray-900 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
            Refresh page
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CourseFilters>({
    search: "",
    category: "",
    level: "",
  });
  const debouncedFilters = useDebounce(filters, 300);
  const { data, isLoading, error } = useCoursesQuery({
    page,
    ...debouncedFilters,
  });

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", level: "" });
    setPage(1);
  };

  const hasFilters = Boolean(filters.search || filters.category || filters.level);

  if (isLoading) {
    return (
      <div className="bg-[#f7f5f1] dark:bg-[#111416]">
        <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
          <section className="border border-gray-300 p-6 dark:border-gray-800">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="mt-3 h-4 w-80" />
          </section>
          <section className="border-x border-b border-gray-300 p-6 dark:border-gray-800">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[300px] rounded-none" />
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
        <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
          <section className="border border-red-300 bg-red-50 p-8 dark:border-red-900/50 dark:bg-red-900/10">
            <h1 className="text-lg font-semibold uppercase tracking-[0.04em] text-red-700 dark:text-red-300">
              Error loading courses
            </h1>
            <p className="mt-2 text-sm leading-7 text-red-700/90 dark:text-red-300/90">
              {error.message}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-5 h-9 rounded-none border-red-300 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              Retry
            </Button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Courses
              </p>
              <h1 className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]">
                Learn with practical, career-focused pathways.
              </h1>
              <p className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300">
                Browse available ACCM courses, refine by level, and find the
                next programme for your professional growth.
              </p>
            </div>
            <div className="flex items-center bg-[#171b1d] px-7 py-10 text-gray-100 sm:px-10">
              <p className="text-sm leading-8 text-gray-300">
                Use search and filters below to quickly narrow down relevant
                course options.
              </p>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="grid gap-4 md:grid-cols-[1fr_0.35fr_0.35fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="h-10 rounded-none border-gray-300 bg-white pl-10 dark:border-gray-700 dark:bg-[#111416]"
              />
            </div>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleFilterChange("category", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.level || "all"}
              onValueChange={(value) =>
                handleFilterChange("level", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!data?.courses || data.courses.length === 0 ? (
            <div className="mt-6">
              <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {data.courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>

              <div className="mt-8 flex justify-center gap-3">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="ghost"
                  className="h-9 rounded-none border border-gray-300 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Previous page
                </Button>
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.hasNextPage}
                  variant="ghost"
                  className="h-9 rounded-none border border-gray-300 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Next page
                </Button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
