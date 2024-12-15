import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { VideoList } from "@/components/video-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VideosPage() {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session) {
    return (
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Please log in and subscribe to a service to access our premium video
          content.
        </p>
        <Link href="/login">
          <Button>Log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Enhance your skills with our curated video content.
      </p>
      <VideoList userEmail={session?.user?.email} />
    </div>
  );
}
