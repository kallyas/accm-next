import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { VideoList } from "@/components/video-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// Mock function to check user subscription
async function checkUserSubscription(userId: string): Promise<boolean> {
  // In a real application, you would check the user's subscription status
  // For now, we'll return true to simulate a subscribed user
  return !true;
}

// Mock video data
const videos = [
  {
    id: "1",
    title: "Introduction to Career Development",
    description: "Learn the basics of career planning and development",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Effective Networking Strategies",
    description: "Master the art of professional networking",
    thumbnailUrl: "https://img.youtube.com/vi/6_b7RDuLwcI/0.jpg",
    videoId: "6_b7RDuLwcI",
  },
  {
    id: "3",
    title: "Resume Writing Tips",
    description: "Create a standout resume that gets you noticed",
    thumbnailUrl: "https://img.youtube.com/vi/Tt08KmFfIYQ/0.jpg",
    videoId: "Tt08KmFfIYQ",
  },
];

export default async function VideosPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Please log in and subscribe to a service to access our premium
              video content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our premium videos offer in-depth insights, tutorials, and expert
              advice to help you advance your career.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline">View Services</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const isSubscribed = await checkUserSubscription(session!.user!.id);

  if (!isSubscribed) {
    return (
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need to subscribe to a service to access our premium video
              content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unlock our full library of premium videos by subscribing to one of
              our mentorship services.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/services">
              <Button>View Available Services</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Enhance your skills with our curated video content.
      </p>
      <VideoList videos={videos} />
    </div>
  );
}
