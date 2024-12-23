"use client";

import React, { useState } from "react";
import { useCoursesQuery } from "@/hooks/use-courses";
import { CourseCard } from "@/components/course-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { CourseFilters } from "@/types/course";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, Search, Filter, Loader2, RefreshCcw } from "lucide-react";

type EmptyStateProps = {
  hasFilters: boolean;
  onClear: () => void;
};

const EmptyState = ({ hasFilters, onClear }: EmptyStateProps) => (
  <Card className="w-full  mx-auto">
    <CardHeader className="text-center">
      <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <CardTitle className="text-2xl">No Courses Found</CardTitle>
      <CardDescription className="text-lg">
        {hasFilters
          ? "Try adjusting your filters or search term."
          : "No courses have been created yet. Check back later or try refreshing the page."}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex justify-center gap-4">
      {hasFilters ? (
        <Button onClick={onClear} variant="default" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Clear Filters
        </Button>
      ) : (
        <Button
          onClick={() => window.location.reload()}
          variant="default"
          className="gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh Page
        </Button>
      )}
    </CardContent>
  </Card>
);

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

  const clearFilters = () =>
    setFilters({ search: "", category: "", level: "" });

  if (isLoading) {
    return (
      <div className="container py-10 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Available Courses</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex flex-wrap gap-4 mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10 max-w-7xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Courses
            </CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasFilters = Boolean(
    filters.search || filters.category || filters.level
  );

  return (
    <div className="container py-10 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Available Courses</h1>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {/* Add category options */}
            </SelectContent>
          </Select>
          <Select
            value={filters.level}
            onValueChange={(value) => handleFilterChange("level", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!data?.courses || data.courses.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous Page
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.hasNextPage}
                variant="outline"
              >
                Next Page
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
