"use client";

import { useEvents } from "@/hooks/use-events";
import { UserEventList } from "@/components/user-event-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      ))}
  </div>
);

export default function UserEventsPage() {
  const { userEvents } = useEvents();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events you have registered for</CardDescription>
        </CardHeader>
        <CardContent>
          {userEvents.isLoading ? (
            <LoadingState />
          ) : userEvents.isError ? (
            <div className="text-red-500">
              Error loading events: {userEvents.error.message}
            </div>
          ) : (
            <UserEventList
              events={userEvents.data || []}
              queryKey={["user-events"]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
