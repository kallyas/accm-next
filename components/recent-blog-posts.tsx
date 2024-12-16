"use client";

import { useBlogs } from "@/hooks/use-blogs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentBlogPosts() {
  const { data, isLoading, isError } = useBlogs(0, 5); // Fetch 5 most recent blogs

  if (isLoading) {
    return <RecentBlogPostsSkeleton />;
  }

  if (isError) {
    return <div>Error loading recent posts</div>;
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data!.blogs.map((blog: any) => (
            <li key={blog.id}>
              <Link
                href={`/blogs/${blog.id}`}
                className="text-sm hover:underline"
              >
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function RecentBlogPostsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <li key={index}>
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
