"use client";

import { useMemo, useState } from "react";
import { usePublications } from "@/hooks/use-publications";
import { PublicationsList } from "@/components/publications-list";
import { Publication } from "@/types/publication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATIC_PUBLICATIONS: Publication[] = [
  {
    id: "static-scope-career-guidance-uganda",
    title: "The Scope of career guidance in uganda",
    authors:
      "Abel W. Walekhwa, African Centre for Career Mentorship (ACCM), Dr. Dan Musinguzi, Al Rayyan International University, Lois Nakibuuka, Andlo Smart Options LTD",
    abstract:
      "Report prepared by Abel W. Walekhwa (African Centre for Career Mentorship), Dr. Dan Musinguzi (Associate Professor, Al Rayyan International University), and Lois Nakibuuka (Andlo Smart Options LTD).",
    externalUrl: "/papers/SCOPE OF CAREER GUIDANCE.pdf",
    publishedDate: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export default function PublicationsPage() {
  const { data: publications, isLoading, error } = usePublications();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const allPublications = useMemo(() => {
    const dbPublications = publications ?? [];
    const staticTitles = new Set(
      STATIC_PUBLICATIONS.map((pub) => pub.title.toLowerCase())
    );

    return [
      ...STATIC_PUBLICATIONS,
      ...dbPublications.filter((pub) => !staticTitles.has(pub.title.toLowerCase())),
    ];
  }, [publications]);

  const years = useMemo(() => {
    const uniqueYears = new Set(
      allPublications.map((pub) => new Date(pub.publishedDate).getFullYear())
    );
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [allPublications]);

  const filteredPublications = useMemo(() => {
    return allPublications
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
            ? new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
            : new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
        }
        return sortOrder === "desc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      });
  }, [allPublications, searchQuery, sortBy, sortOrder, selectedYear]);

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Publications
              </p>
              <h1 className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]">
                Research and thought leadership from ACCM.
              </h1>
              <p className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300">
                Explore reports and publications on mentorship, career
                development, and workforce transformation.
              </p>
            </div>
            <div className="flex items-center bg-[#171b1d] px-7 py-10 text-gray-100 sm:px-10">
              <p className="text-sm leading-8 text-gray-300">
                Use year and sorting controls to scan recent work quickly.
              </p>
            </div>
          </div>
        </section>

        {isLoading && !publications ? (
          <LoadingState />
        ) : (
          <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
            {error ? <ErrorState /> : null}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-none border-gray-300 bg-white pl-10 dark:border-gray-700 dark:bg-[#111416]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-10 w-[150px] rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]">
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

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (sortBy === "date") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("date");
                      setSortOrder("desc");
                    }
                  }}
                  className="h-10 rounded-none border border-gray-300 px-3 dark:border-gray-700"
                >
                  <Calendar className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (sortBy === "title") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("title");
                      setSortOrder("desc");
                    }
                  }}
                  className="h-10 rounded-none border border-gray-300 px-3 dark:border-gray-700"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="h-10 rounded-none border border-gray-300 px-3 dark:border-gray-700"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredPublications.length === 0 ? (
              <EmptyState searchQuery={searchQuery} />
            ) : (
              <>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  Showing {filteredPublications.length} publications
                </p>
                <PublicationsList publications={filteredPublications} />
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <section className="border-x border-b border-gray-300 p-6 dark:border-gray-800">
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-10 w-full rounded-none" />
        <Skeleton className="h-10 w-full rounded-none" />
        <Skeleton className="h-10 w-full rounded-none" />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 border border-gray-300 p-4 dark:border-gray-800">
            <Skeleton className="h-7 w-3/4 rounded-none" />
            <Skeleton className="h-4 w-1/2 rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded-none" />
              <Skeleton className="h-4 w-24 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ErrorState() {
  return (
    <Alert
      variant="destructive"
      className="mb-5 rounded-none border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10"
    >
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
    <div className="border border-gray-300 bg-white/70 p-10 text-center dark:border-gray-800 dark:bg-[#171b1d]">
      <BookOpen className="mx-auto h-10 w-10 text-gray-600 dark:text-gray-300" />
      <h3 className="mt-4 text-lg font-semibold uppercase tracking-[0.04em]">
        No publications found
      </h3>
      <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
        {searchQuery
          ? `No publications match "${searchQuery}".`
          : "No publications available at the moment."}
      </p>
    </div>
  );
}
