"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, MapPin, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

const events = [
  {
    id: 1,
    title: "Career Development Workshop",
    description: "Learn essential skills for advancing your career in any industry.",
    date: new Date("2023-08-15T10:00:00"),
    location: "Virtual",
    capacity: 100,
    registered: 75,
  },
  {
    id: 2,
    title: "Networking Mixer",
    description: "Connect with professionals from various industries and expand your network.",
    date: new Date("2023-09-01T18:00:00"),
    location: "Nairobi, Kenya",
    capacity: 50,
    registered: 30,
  },
  {
    id: 3,
    title: "Leadership Seminar",
    description: "Develop your leadership skills with insights from top industry leaders.",
    date: new Date("2023-09-20T14:00:00"),
    location: "Virtual",
    capacity: 200,
    registered: 150,
  },
]

export function EventList() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)

  const handleRegister = (event: typeof events[0]) => {
    // Here you would typically make an API call to register the user
    toast({
      title: "Registration Successful",
      description: `You have been registered for ${event.title}`,
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(event.date, "PPP")}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4" />
              <span>{event.registered} / {event.capacity} registered</span>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedEvent(event)}>View Details</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedEvent?.title}</DialogTitle>
                  <DialogDescription>{selectedEvent?.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p><strong>Date:</strong> {selectedEvent && format(selectedEvent.date, "PPP")}</p>
                  <p><strong>Time:</strong> {selectedEvent && format(selectedEvent.date, "p")}</p>
                  <p><strong>Location:</strong> {selectedEvent?.location}</p>
                  <p><strong>Capacity:</strong> {selectedEvent?.capacity}</p>
                  <p><strong>Registered:</strong> {selectedEvent?.registered}</p>
                </div>
                <DialogFooter>
                  <Button onClick={() => selectedEvent && handleRegister(selectedEvent)}>Register</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

