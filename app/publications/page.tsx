"use client";

import { useState, useMemo } from "react";
import { usePublications } from "@/hooks/use-publications";
import { PublicationsList } from "@/components/publications-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Search,
  Calendar,
  BookOpen,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PublicationsPage() {
  const { data: publications, isLoading, error } = usePublications();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Get unique years from publications
  const years = useMemo(() => {
    if (!publications) return [];
    const uniqueYears = new Set(
      publications.map((pub) => new Date(pub.publishedDate).getFullYear())
    );
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [publications]);

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    if (!publications) return [];

    return publications
      .filter((pub) => {
        const matchesSearch =
          pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pub.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pub.abstract.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesYear =
          selectedYear === "all" ||
          new Date(pub.publishedDate).getFullYear().toString() === selectedYear;

        return matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortOrder === "desc"
            ? new Date(b.publishedDate).getTime() -
                new Date(a.publishedDate).getTime()
            : new Date(a.publishedDate).getTime() -
                new Date(b.publishedDate).getTime();
        } else {
          return sortOrder === "desc"
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }
      });
  }, [publications, searchQuery, sortBy, sortOrder, selectedYear]);

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Research Publications</h1>
        <p className="text-xl text-muted-foreground">
          Explore our latest research and insights on career development and
          mentorship.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (sortBy === "date") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("date");
                      setSortOrder("desc");
                    }
                  }}
                  className={sortBy === "date" ? "bg-primary/10" : ""}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (sortBy === "title") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("title");
                      setSortOrder("desc");
                    }
                  }}
                  className={sortBy === "title" ? "bg-primary/10" : ""}
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowUpDown
                    className="h-4 w-4"
                    onClick={() =>
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                    }
                  />
                </Button>
              </div>
            </div>
          </div>

          {filteredPublications.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing {filteredPublications.length} publications
              </p>
              <PublicationsList publications={filteredPublications} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load publications. Please try again later.
      </AlertDescription>
    </Alert>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-12">
      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No publications found</h3>
      <p className="text-muted-foreground">
        {searchQuery
          ? `No publications match "${searchQuery}"`
          : "No publications available at the moment."}
      </p>
    </div>
  );
}
