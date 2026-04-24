"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blog } from "@/hooks/use-blogs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function BlogCard({
  post,
  index,
}: {
  post: Blog;
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
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF]  ">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1B4B]/5 ">
          <div className="flex h-full items-center justify-center">
            <FileText className="h-12 w-12 text-[#1A1B4B]/60 " />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-[#1A1B4B]/70 ">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(post.createdAt), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold uppercase leading-tight line-clamp-2">
            {post.title}
          </h3>
          <div
            className="mt-3 text-sm leading-6 text-[#1A1B4B]  line-clamp-3 prose prose-sm "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <Link
            href={`/blogs/${post.id}`}
            className="mt-5 flex h-10 w-full items-center justify-center border border-[#1A1B4B]/20 bg-[#FFFFFF] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10    "
          >
            Read more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function BlogList({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}