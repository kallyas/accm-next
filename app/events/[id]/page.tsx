import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { RegisterButton } from "@/components/register-button";

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const event = await db.event.findUnique({
    where: { id: params.id },
    include: {
      users: {
        where: { userId: session!.user!.id },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const isRegistered = event.users.length > 0;

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">{event.title}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{new Date(event.startDate).toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          {isRegistered ? (
            <Button disabled>Already Registered</Button>
          ) : (
            <RegisterButton eventId={event.id} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
