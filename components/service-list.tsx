"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

const services = [
  {
    id: 1,
    name: "Basic Mentorship",
    description: "One-on-one mentorship sessions with experienced professionals",
    price: 50,
    features: ["Monthly 1-hour session", "Career guidance", "Resume review"]
  },
  {
    id: 2,
    name: "Premium Career Development",
    description: "Comprehensive career development program with multiple mentors",
    price: 100,
    features: ["Weekly 1-hour sessions", "Personalized career plan", "Skills assessment", "Job search assistance"]
  },
  {
    id: 3,
    name: "Executive Leadership Program",
    description: "Intensive program for aspiring and current executives",
    price: 200,
    features: ["Bi-weekly 2-hour sessions", "Leadership skills development", "Networking opportunities", "Executive coaching"]
  }
]

export function ServiceList({ userEmail }: { userEmail?: string | null }) {
  const [subscribing, setSubscribing] = useState<number | null>(null)

  const handleSubscribe = async (serviceId: number) => {
    if (!userEmail) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe to a service.",
        variant: "destructive",
      })
      return
    }

    setSubscribing(serviceId)
    // Here you would typically make an API call to your backend to handle the subscription
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
    setSubscribing(null)
    toast({
      title: "Subscribed!",
      description: "You have successfully subscribed to the service.",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>${service.price} / month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleSubscribe(service.id)}
              disabled={subscribing === service.id}
            >
              {subscribing === service.id ? "Subscribing..." : "Subscribe"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

