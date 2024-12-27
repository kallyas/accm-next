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

interface UserEventListProps {
  events: Event[];
}

export function UserEventList({ events }: UserEventListProps) {
  const { unregisterForEvent } = useEvents();

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterForEvent.mutateAsync(eventId);
      toast({ title: "Successfully unregistered from the event" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unregister from the event",
        variant: "destructive",
      });
    }
  };

  if (events.length === 0) {
    return <p>You haven't registered for any events yet.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(event.startDate).toLocaleString()} -{" "}
                {new Date(event.endDate).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.registeredCount} registered</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() => handleUnregister(event.id)}
              disabled={unregisterForEvent.isPending}
            >
              Unregister
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
