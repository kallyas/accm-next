"use client";

import { useEvents } from "@/hooks/use-events";
import { UserEventList } from "@/components/user-event-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
            <p>Loading events...</p>
          ) : userEvents.isError ? (
            <p>Error loading events: {userEvents.error.message}</p>
          ) : (
            <UserEventList events={userEvents.data || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
