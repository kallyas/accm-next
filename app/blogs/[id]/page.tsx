import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// This would typically come from a database
const blogPosts = [
  {
    id: "1",
    title: "The Importance of Mentorship in Career Development",
    content: "Mentorship plays a crucial role in career development...",
    date: "2023-07-01",
    author: "Dr. Abel Wilson",
  },
  {
    id: "2",
    title: "5 Key Skills for Success in the Digital Age",
    content:
      "In today's rapidly evolving job market, certain skills have become essential...",
    date: "2023-07-05",
    author: "Sarah Mutesi",
  },
];

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find((post) => post.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <CardDescription>
            {post.date} | By {post.author}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
