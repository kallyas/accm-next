import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { toast } from "@/hooks/use-toast";
import { Event } from "@/types/event";
import { useQueryClient } from "@tanstack/react-query";

interface UserEventListProps {
  events: Event[];
  queryKey: readonly unknown[];
}

export function UserEventList({ events, queryKey }: UserEventListProps) {
  const { unregisterForEvent } = useEvents();
  const queryClient = useQueryClient();

  const handleUnregister = async (eventId: string) => {
    // Get the current events from the cache
    const previousEvents = queryClient.getQueryData(queryKey) as Event[];

    // Optimistically update the UI
    queryClient.setQueryData(queryKey, (old: Event[] | undefined) =>
      (old || []).filter((event) => event.id !== eventId)
    );

    try {
      await unregisterForEvent.mutateAsync(eventId);
      toast({ title: "Successfully unregistered from the event" });

      // Invalidate both user events and main events queries
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
    } catch (error) {
      // Revert the optimistic update on error
      queryClient.setQueryData(queryKey, previousEvents);
      toast({
        title: "Error",
        description: "Failed to unregister from the event",
        variant: "destructive",
      });
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>You haven't registered for any events yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardHeader>
            <CardTitle className="line-clamp-1">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {event.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>
                    Starts: {new Date(event.startDate).toLocaleDateString()} at{" "}
                    {new Date(event.startDate).toLocaleTimeString()}
                  </span>
                  <span>
                    Ends: {new Date(event.endDate).toLocaleDateString()} at{" "}
                    {new Date(event.endDate).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>
                  {event.registeredCount}{" "}
                  {event.registeredCount === 1 ? "person" : "people"} registered
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleUnregister(event.id)}
              disabled={unregisterForEvent.isPending}
            >
              {unregisterForEvent.isPending ? "Unregistering..." : "Unregister"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
