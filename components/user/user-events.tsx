"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
};

export function UserEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Career Workshop",
      date: "2023-08-15",
      location: "Virtual",
    },
    {
      id: "2",
      title: "Networking Mixer",
      date: "2023-09-01",
      location: "Nairobi, Kenya",
    },
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Location: {event.location}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
