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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  Share2, 
  UserPlus, 
  CalendarDays, 
  Check, 
  Building,
  CalendarCheck,
  Info,
  ExternalLink
} from "lucide-react";
import { RegisterButton } from "@/components/register-button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { format, isAfter, differenceInDays } from "date-fns";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Format duration between two dates
const formatDuration = (startDate: Date, endDate: Date) => {
  const diffMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes`;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

// Check if event is upcoming
const isUpcoming = (date: Date) => {
  return isAfter(date, new Date());
};

// Check if event is happening soon (within 7 days)
const isEventSoon = (date: Date) => {
  const daysUntil = differenceInDays(date, new Date());
  return daysUntil >= 0 && daysUntil <= 7;
};

// Format location (virtual or physical)
const formatLocation = (location: string) => {
  const isVirtual = location.toLowerCase().includes("virtual") || 
                   location.toLowerCase().includes("online") || 
                   location.toLowerCase().includes("zoom");
  
  return {
    text: location,
    isVirtual
  };
};

// Share event function
const shareEvent = async (title: string, url: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        url: url
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(url);
  }
};

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/login?callbackUrl=/events/${params.id}`);
  }

  const event = await db.event.findUnique({
    where: { id: params.id },
    include: {
      users: {
        where: { userId: session.user.id },
      },
      _count: {
        select: { users: true }
      }
    },
  });

  if (!event) {
    notFound();
  }

  const isRegistered = event.users.length > 0;
  const registeredCount = event._count.users;
  
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const eventDuration = formatDuration(startDate, endDate);
  const upcoming = isUpcoming(startDate);
  const soonEvent = isEventSoon(startDate);
  const location = formatLocation(event.location);
  
  // Calculate dates for display
  const formattedStartDate = format(startDate, "EEEE, MMMM d, yyyy");
  const formattedStartTime = format(startDate, "h:mm a");
  const formattedEndTime = format(endDate, "h:mm a");
  const isSameDay = format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd");
  
  // URL for sharing
  const eventUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/events/${params.id}`
    : `/events/${params.id}`;

  return (
    <div className="min-h-screen py-10">
      {/* Header with Back Button */}
      <div className="container mb-6">
        <Link href="/events" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
        
        <div className="flex flex-wrap justify-between items-start gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-blue-200 dark:border-blue-800/50"
                    onClick={() => shareEvent(event.title, eventUrl)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container grid gap-8 md:grid-cols-3">
        {/* Left Column - Event Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Event Banner */}
          <div className="relative rounded-xl overflow-hidden h-64 md:h-96 shadow-lg">
            {event.bannerUrl ? (
              <Image
                src={event.bannerUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center">
                <Calendar className="w-24 h-24 text-white" />
              </div>
            )}
            
            {/* Event Status Badge */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {!upcoming && (
                <Badge variant="default" className="bg-gray-500">
                  Past Event
                </Badge>
              )}
              {upcoming && soonEvent && (
                <Badge variant="default" className="bg-amber-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
              )}
              {isRegistered && (
                <Badge variant="default" className="bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Registered
                </Badge>
              )}
              {location.isVirtual && (
                <Badge variant="default" className="bg-blue-500">
                  Virtual Event
                </Badge>
              )}
            </div>
          </div>
          
          {/* Event Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-muted-foreground">
                {event.description}
              </p>
            </CardContent>
          </Card>
          
          {/* Organizer Info (if available) */}
          {event.organizer && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{event.organizer}</h3>
                    <p className="text-sm text-muted-foreground">Event Host</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Additional Details (if available) */}
          {event.additionalInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">
                  {event.additionalInfo}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Registration & Info */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card className="border-2 border-blue-100 dark:border-blue-900/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Registration</CardTitle>
              <CardDescription>
                {upcoming ? (
                  isRegistered ? 
                    "You're registered for this event" : 
                    "Register to attend this event"
                ) : (
                  "This event has already passed"
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-6">
              {/* If event has passed */}
              {!upcoming && (
                <Alert variant="default" className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <Calendar className="h-4 w-4" />
                  <AlertTitle>Event has ended</AlertTitle>
                  <AlertDescription>
                    This event took place on {formattedStartDate}.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* If registered */}
              {upcoming && isRegistered && (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30">
                  <CalendarCheck className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">You're all set!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    We've confirmed your registration for this event.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Attendee Count */}
              <div className="mt-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {registeredCount} {registeredCount === 1 ? 'person' : 'people'} attending
                </span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              {upcoming && (
                isRegistered ? (
                  <Button
                    variant="outline"
                    className="w-full border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 dark:border-red-900/50 dark:hover:border-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Cancel Registration
                  </Button>
                ) : (
                  <RegisterButton eventId={event.id} className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600" />
                )
              )}
            </CardFooter>
          </Card>
          
          {/* Event Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-muted-foreground">
                    {formattedStartDate}
                    <br />
                    {formattedStartTime} - {formattedEndTime} 
                    {!isSameDay && ` (${format(endDate, "MMM d")})`}
                  </p>
                  <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                    Duration: {eventDuration}
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-start gap-3">
                {location.isVirtual ? (
                  <Building className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                ) : (
                  <MapPin className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-medium">
                    {location.isVirtual ? "Virtual Location" : "Location"}
                  </h3>
                  <p className="text-muted-foreground">{location.text}</p>
                  
                  {/* Virtual meeting link or directions */}
                  {location.isVirtual && event.meetingLink && (
                    <a 
                      href={event.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Join Meeting
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                  
                  {!location.isVirtual && (
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(location.text)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View on Map
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Category (if available) */}
              {event.category && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Event Type</h3>
                    <p className="text-muted-foreground capitalize">{event.category}</p>
                  </div>
                </div>
              )}
              
              {/* Add to Calendar Option */}
              {upcoming && (
                <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 border-blue-200 dark:border-blue-900/50"
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Related Events (Placeholder - implement if needed) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Similar Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check out other events you might be interested in.
              </p>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                asChild
              >
                <Link href="/events">
                  Browse All Events
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for "Add to Calendar" button
const CalendarPlus = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <line x1="12" x2="12" y1="14" y2="18" />
    <line x1="10" x2="14" y1="16" y2="16" />
  </svg>
);