"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Event = {
  id: string;
  title: string;
  date: Date;
  location: string;
  bannerImage: string;
};

const events = [
  {
    id: "1",
    title: "Career Development Workshop",
    date: new Date("2023-08-15"),
    location: "Virtual",
    bannerImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Networking Mixer",
    date: new Date("2023-09-01"),
    location: "Nairobi, Kenya",
    bannerImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "Leadership Seminar",
    date: new Date("2023-09-20"),
    location: "Virtual",
    bannerImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    title: "Tech Talk",
    date: new Date("2023-10-05"),
    location: "Virtual",
    bannerImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "5",
    title: "Startup Pitch Competition",
    date: new Date("2023-10-20"),
    location: "Virtual",
    bannerImage: "/placeholder.svg?height=200&width",
  },
  {
    id: "6",
    title: "Web Development Bootcamp",
    date: new Date("2023-11-10"),
    location: "Virtual",
    bannerImage: "/placeholder.svg?height=200&width=400",
  },
];

function EventList() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleRegister = (event: Event) => {
    // Here you would typically make an API call to register the user
    toast({
      title: "Registration Successful",
      description: `You have been registered for ${event.title}`,
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="relative w-full h-48 mb-4">
              <Image
                src="https://via.placeholder.com/400x200"
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(event.date, "PPP")}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedEvent(event)}>
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedEvent?.title}</DialogTitle>
                  <DialogDescription>
                    {selectedEvent?.location}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative w-full h-64">
                    <Image
                      src={selectedEvent?.bannerImage || ""}
                      alt={selectedEvent?.title || ""}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <p>
                    <strong>Date:</strong>{" "}
                    {selectedEvent && format(selectedEvent.date, "PPP")}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {selectedEvent && format(selectedEvent.date, "p")}
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() =>
                      selectedEvent && handleRegister(selectedEvent)
                    }
                  >
                    Register
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Upcoming Events</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Join our workshops, webinars, and networking events to boost your
        career.
      </p>
      <EventList />
    </div>
  );
}
