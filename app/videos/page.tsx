import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { VideoList } from "@/components/video-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function VideosPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Please log in and subscribe to a service to access our premium video content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our premium videos offer in-depth insights, tutorials, and expert advice to help you advance your career.
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
    )
  }

  // Check if the user is subscribed (you'll need to implement this logic)
  const isSubscribed = await checkUserSubscription(session?.user?.id)
  console.log(isSubscribed)

  if (!isSubscribed) {
    return (
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need to subscribe to a service to access our premium video content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unlock our full library of premium videos by subscribing to one of our mentorship services.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/services">
              <Button>View Available Services</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Premium Videos</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Enhance your skills with our curated video content.
      </p>
      <VideoList userEmail={session?.user?.email} />
    </div>
  )
}

// This function should be implemented to check the user's subscription status
async function checkUserSubscription(userId: string): Promise<boolean> {
  // Implement the logic to check if the user is subscribed
  // This might involve querying your database or checking with a payment provider
  // For now, we'll return a placeholder value
  return false
}

