"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Blog } from "@/hooks/use-blogs";


export function BlogList({ blogs }: { blogs: Blog[] }) {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {post.createdAt} | By {post.author}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <article
                className="prose"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
            <CardFooter>
              <Link href={`/blogs/${post.id}`}>
                <Button>Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
