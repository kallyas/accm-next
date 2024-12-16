"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentBlogPosts } from "@/components/recent-blog-posts";
import { useBlogPost } from "@/hooks/use-blogs";

export default function BlogPost() {
  const params = useParams();
  const { data: post, isLoading, isError } = useBlogPost(params.id as string);

  if (isLoading) {
    return <BlogPostSkeleton />;
  }

  if (isError) {
    return <div>Error loading blog post</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{post!.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-4 mt-2">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${post!.author}`}
                    />
                    <AvatarFallback>
                      {post!.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post!.author}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {new Date(post!.createdAt).toLocaleDateString()}
                      <ClockIcon className="ml-4 mr-1 h-3 w-3" />
                      {`${Math.ceil(
                        post!.content.split(" ").length / 200
                      )} min read`}
                    </div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: post!.content }}
              />
              {post!.tags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post!.tags.map((tag: string) => (
                    <div
                      key={tag}
                      className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm"
                    >
                      <TagIcon className="mr-1 h-3 w-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-1/3 space-y-6">
          <RecentBlogPosts />
          <AuthorBio author={post!.author} />
          <RelatedTags tags={[]} />
        </div>
      </div>
    </div>
  );
}

function AuthorBio({ author }: { author: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Author</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${author}`}
            />
            <AvatarFallback>
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{author}</h3>
            <p className="text-sm text-muted-foreground">
              {author} is a passionate writer and expert in their field. They
              have been contributing valuable content to our blog for several
              years.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RelatedTags({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm"
            >
              <TagIcon className="mr-1 h-3 w-3" />
              {tag}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BlogPostSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center space-x-4 mt-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-1/3 space-y-6">
          <RecentBlogPosts />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <Skeleton className="h-4 w-full mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
