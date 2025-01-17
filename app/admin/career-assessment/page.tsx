"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, Download, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Assessment {
  id: string;
  suggestedCareer: string;
  confidenceScore: number;
  completedAt: string;
  matchingFactors: string[];
  careerUser: {
    name: string;
    age: string;
    gender: string;
    location: string;
    isAuthenticated: boolean;
  };
}

interface CareerPath {
  careerPath: string;
  totalSuggestions: number;
  averageConfidence: number;
}

interface QueryParams {
  page: number;
  search: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortOrder: string;
}

// API fetching function
const fetchAssessments = async ({
  page,
  search,
  startDate,
  endDate,
  sortBy,
  sortOrder,
}: QueryParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    sortBy,
    sortOrder,
    ...(search && { search }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });

  const response = await fetch(`/api/admin/career-assessments?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch assessments");
  }
  return response.json();
};

export default function AdminCareerAssessments() {
  // Query states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("completedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Tanstack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "assessments",
      { currentPage, search, startDate, endDate, sortBy, sortOrder },
    ],
    queryFn: () =>
      fetchAssessments({
        page: currentPage,
        search,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      }),
    staleTime: 5000,
  });

  const handleExport = async () => {
    toast({
      title: "Export Started",
      description: "Your export will be ready shortly",
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setCurrentPage(1); // Reset to first page on date change
  };

  if (isError) {
    return (
      <Card className="m-4">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-4">Failed to load assessments</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const summary = data?.data.summary || {
    totalAssessments: 0,
    averageConfidence: 0,
    topCareerPaths: [],
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {summary.totalAssessments.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(summary.averageConfidence * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Career Path</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {summary.topCareerPaths[0]?.careerPath || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by career or user name..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="pl-9 w-40"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="pl-9 w-40"
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            Showing page {currentPage} of {data?.data.pagination.pages || 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Career Match</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.assessments.map((assessment: Assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {assessment.careerUser.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {assessment.careerUser.age} •{" "}
                            {assessment.careerUser.gender}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{assessment.suggestedCareer}</TableCell>
                      <TableCell>
                        {(assessment.confidenceScore * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell>{assessment.careerUser.location}</TableCell>
                      <TableCell>
                        {format(
                          new Date(assessment.completedAt),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: data?.data.pagination.pages || 1 },
                      (_, i) => i + 1
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(data?.data.pagination.pages || 1, p + 1)
                          )
                        }
                        disabled={
                          currentPage === (data?.data.pagination.pages || 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
