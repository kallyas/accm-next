"use client";

import { useEvents } from "@/hooks/use-events";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  isRegistering: boolean;
  alreadyRegistered?: boolean;
}

const EventCard = ({
  event,
  onRegister,
  onUnregister,
  alreadyRegistered = false,
  isRegistering,
}: EventCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-lg">
    {event.bannerUrl && (
      <div className="relative h-48 w-full">
        <Image
          src={event.bannerUrl}
          alt={event.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform hover:scale-105"
        />
      </div>
    )}
    <CardHeader>
      <CardTitle className="line-clamp-2">{event.title}</CardTitle>
      <CardDescription className="line-clamp-3">
        {event.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
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
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {event.registeredCount}{" "}
            {event.registeredCount === 1 ? "person" : "people"} registered
          </span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      {alreadyRegistered ? (
        <Button
          className="w-full"
          onClick={() => onUnregister!(event.id)}
          disabled={isRegistering}
          variant="destructive"
        >
          {isRegistering ? "Unregistering..." : "Unregister"}
        </Button>
      ) : (
        <Button
          className="w-full"
          onClick={() => onRegister(event.id)}
          disabled={isRegistering}
        >
          {isRegistering ? "Registering..." : "Register Now"}
        </Button>
      )}
    </CardFooter>
  </Card>
);

const LoadingEventCard = () => (
  <Card className="overflow-hidden">
    <div className="h-48 w-full">
      <Skeleton className="h-full w-full" />
    </div>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-2/3 mt-1" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

export default function EventsPage() {
  const router = useRouter();
  const { events, registerForEvent, unregisterForEvent, isUserRegistered } =
    useEvents();

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent.mutateAsync(eventId);
      toast({
        title: "Successfully registered!",
        description: "You have been registered for the event.",
      });
      router.push("/dashboard/events");
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterForEvent.mutateAsync(eventId);
      toast({
        title: "Successfully unregistered!",
        description: "You have been unregistered from the event.",
      });
      router.push("/events");
    } catch (error) {
      toast({
        title: "Unregistration failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleCheckIsRegistered = (eventId: string) => {
    const result = isUserRegistered(eventId);
    return result.data ?? false;
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="text-muted-foreground">
            Discover and register for exciting events in your area
          </p>
        </div>

        {events.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {events.error instanceof Error
                ? events.error.message
                : "Failed to load events. Please try again later."}
            </AlertDescription>
          </Alert>
        )}

        <div
          className={cn(
            "grid gap-6 grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-3",
            "xl:grid-cols-4"
          )}
        >
          {events.isLoading &&
            Array(8)
              .fill(0)
              .map((_, index) => <LoadingEventCard key={index} />)}

          {events.isSuccess && events.data.length === 0 && (
            <Alert className="col-span-full">
              <AlertTitle>No events found</AlertTitle>
              <AlertDescription>
                There are no upcoming events at the moment. Please check back
                later.
              </AlertDescription>
            </Alert>
          )}

          {events.isSuccess &&
            events.data.map((event) => {
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  isRegistering={registerForEvent.isPending}
                  onUnregister={handleUnregister}
                  // alreadyRegistered={handleCheckIsRegistered(event.id)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
