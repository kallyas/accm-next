"use client";

import { useState } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
};

const ITEMS_PER_PAGE = 6;

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Importance of Mentorship in Career Development",
    excerpt:
      "Discover how mentorship can accelerate your professional growth...",
    date: "2023-07-01",
    author: "Dr. Abel Wilson",
  },
  {
    id: "2",
    title: "5 Key Skills for Success in the Digital Age",
    excerpt:
      "Learn about the essential skills that will set you apart in today's job market...",
    date: "2023-07-05",
    author: "Sarah Mutesi",
  },
  {
    id: "3",
    title: "Navigating Career Transitions: A Guide",
    excerpt:
      "Thinking about switching careers? Here's what you need to know...",
    date: "2023-07-10",
    author: "John Doe",
  },
  {
    id: "4",
    title: "The Rise of Remote Work: Challenges and Opportunities",
    excerpt:
      "Explore the pros and cons of remote work and how to thrive in a distributed team...",
    date: "2023-07-15",
    author: "Jane Smith",
  },
  {
    id: "5",
    title: "Building a Personal Brand in the Digital Era",
    excerpt:
      "Learn how to create a strong online presence that boosts your career...",
    date: "2023-07-20",
    author: "Michael Johnson",
  },
  {
    id: "6",
    title: "The Future of Work: AI and Human Collaboration",
    excerpt: "Discover how AI is shaping the workplace and how to adapt...",
    date: "2023-07-25",
    author: "Emily Brown",
  },
  {
    id: "7",
    title: "Effective Networking Strategies for Introverts",
    excerpt:
      "Networking doesn't have to be daunting. Learn techniques tailored for introverts...",
    date: "2023-07-30",
    author: "David Lee",
  },
  {
    id: "8",
    title: "Mastering the Art of Negotiation in Your Career",
    excerpt:
      "Develop crucial negotiation skills to advance your career and achieve your goals...",
    date: "2023-08-04",
    author: "Olivia Taylor",
  },
  {
    id: "9",
    title: "The Power of Continuous Learning in Professional Growth",
    excerpt:
      "Explore why lifelong learning is essential and how to cultivate a growth mindset...",
    date: "2023-08-09",
    author: "Robert Chen",
  },
];

export function BlogList() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {post.date} | By {post.author}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/blogs/${post.id}`}>
                <Button>Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center items-center mt-8 space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
