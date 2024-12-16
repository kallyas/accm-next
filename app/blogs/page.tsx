"use client";

import { useState } from "react";
import { useBlogs } from "@/hooks/use-blogs";
import { BlogList } from "@/components/blog-list";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

export default function BlogsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useBlogs(page);

  if (isLoading) return <SkeletonLoader />;
  if (isError) {
    return <div>Error loading blogs</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
      <BlogList blogs={data!.blogs} />
      <div className="flex justify-center items-center mt-8 space-x-2">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <span>
          Page {page + 1} of {data!.pageInfo.total}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === data!.pageInfo.total - 1}
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
