"use client";

import { useState, useEffect } from "react";
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
import { 
  Calendar, 
  MapPin, 
  Users, 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  Check, 
  UserPlus, 
  CalendarDays,
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  ThumbsUp,
  X,
  Sparkles,
  Building
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { format, isAfter, isBefore, isSameDay, addMonths } from "date-fns";
import axios from "axios";

// Separate hook for checking registration status
const useRegistrationStatus = (eventId: string) => {
  return useQuery({
    queryKey: ["registration-status", eventId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/events/${eventId}/is-registered`
        );
        return response.data.isRegistered;
      } catch (error) {
        return false;
      }
    },
    enabled: !!eventId,
  });
};

// Event categories for filtering
const EVENT_CATEGORIES = [
  { value: "all", label: "All Events" },
  { value: "workshop", label: "Workshops" },
  { value: "seminar", label: "Seminars" },
  { value: "networking", label: "Networking" },
  { value: "conference", label: "Conferences" },
  { value: "training", label: "Training" },
];

// Time periods for filtering
const TIME_PERIODS = [
  { value: "all", label: "Any Time" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "next-month", label: "Next Month" },
  { value: "future", label: "Future Events" },
];

// Get formatted event date range
const getEventDateFormatted = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If same day
  if (isSameDay(start, end)) {
    return (
      <>
        <span className="font-medium">{format(start, "EEEE, MMMM d, yyyy")}</span>
        <br />
        <span className="text-muted-foreground">{format(start, "h:mm a")} - {format(end, "h:mm a")}</span>
      </>
    );
  }
  
  // Different days
  return (
    <>
      <span className="font-medium">From: {format(start, "EEEE, MMM d")} at {format(start, "h:mm a")}</span>
      <br />
      <span className="text-muted-foreground">To: {format(end, "EEEE, MMM d")} at {format(end, "h:mm a")}</span>
    </>
  );
};

// Is the event happening soon (within 7 days)?
const isEventSoon = (startDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const diffTime = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
};

// Is the event popular (more than 20 registrations)?
const isEventPopular = (registeredCount: number) => {
  return registeredCount >= 20;
};

// Format the location (virtual or physical)
const formatLocation = (location: string) => {
  const isVirtual = location.toLowerCase().includes("virtual") || 
                   location.toLowerCase().includes("online") || 
                   location.toLowerCase().includes("zoom");
  
  return {
    text: location,
    isVirtual
  };
};

// Enhanced EventCard component
interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
  onUnregister: (eventId: string) => void;
  isRegistering: boolean;
  isAuthenticated: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

const EventCard = ({
  event,
  onRegister,
  onUnregister,
  isRegistering,
  isAuthenticated,
  onClick,
  showDetails = false,
}: EventCardProps) => {
  const router = useRouter();
  const { data: isRegistered = false, isLoading: isCheckingRegistration } =
    useRegistrationStatus(event.id);
  
  const location = formatLocation(event.location);
  const isSoon = isEventSoon(event.startDate);
  const isPopular = isEventPopular(event.registeredCount);
  
  const handleLoginRedirect = () => {
    router.push("/login?callbackUrl=/events");
  };

  const renderButton = () => {
    if (!isAuthenticated) {
      return (
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600" 
          onClick={handleLoginRedirect}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Login to Register
        </Button>
      );
    }

    if (isCheckingRegistration) {
      return (
        <Button className="w-full" disabled>
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          Checking status...
        </Button>
      );
    }

    if (isRegistered) {
      return (
        <Button
          className="w-full"
          onClick={() => onUnregister(event.id)}
          disabled={isRegistering}
          variant="outline"
          size="lg"
        >
          {isRegistering ? (
            <>
              <Skeleton className="h-4 w-4 mr-2 rounded-full animate-pulse" />
              Unregistering...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Registered
            </>
          )}
        </Button>
      );
    }

    return (
      <Button
        className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
        onClick={(e) => {
          e.stopPropagation();
          onRegister(event.id);
        }}
        disabled={isRegistering}
        size="lg"
      >
        {isRegistering ? (
          <>
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            Registering...
          </>
        ) : (
          <>
            <CalendarDays className="h-4 w-4 mr-2" />
            Register Now
          </>
        )}
      </Button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "h-full",
        showDetails ? "col-span-full" : "col-span-1"
      )}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all h-full flex flex-col cursor-pointer border-2",
          isRegistered 
            ? "border-blue-500 shadow-md shadow-blue-500/10" 
            : "border-transparent hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg",
          showDetails && "md:flex-row"
        )}
        onClick={onClick}
      >
        {/* Event Image - Larger for detail view */}
        <div 
          className={cn(
            "relative overflow-hidden",
            showDetails ? "h-64 md:h-auto md:w-1/3 flex-shrink-0" : "h-48 w-full"
          )}
        >
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center">
              <CalendarIcon className="w-16 h-16 text-white" />
            </div>
          )}
          
          {/* Event Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-2">
            {isSoon && (
              <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                <Clock className="h-3 w-3 mr-1" />
                Soon
              </Badge>
            )}
            
            {isPopular && (
              <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                <Sparkles className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            
            {location.isVirtual && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                Virtual
              </Badge>
            )}
            
            {isRegistered && (
              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                <Check className="h-3 w-3 mr-1" />
                Registered
              </Badge>
            )}
          </div>
        </div>
        
        <div className={cn(
          "flex flex-col flex-grow",
          showDetails && "md:w-2/3"
        )}>
          <CardHeader className={showDetails ? "md:pt-8" : ""}>
            <CardTitle className={cn(
              "line-clamp-2 text-xl",
              showDetails && "text-2xl"
            )}>
              {event.title}
            </CardTitle>
            <CardDescription className={cn(
              "line-clamp-3",
              showDetails && "line-clamp-none"
            )}>
              {event.description}
            </CardDescription>
          </CardHeader>
          
          {/* Event Details */}
          <CardContent className="flex-grow">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                <div>
                  {getEventDateFormatted(event.startDate, event.endDate)}
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm">
                {location.isVirtual ? (
                  <Building className="h-4 w-4 mt-1 flex-shrink-0 text-green-500" />
                ) : (
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-red-500" />
                )}
                <span className={showDetails ? "" : "line-clamp-1"}>
                  {event.location}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 flex-shrink-0 text-purple-500" />
                <span>
                  {event.registeredCount}{" "}
                  {event.registeredCount === 1 ? "person" : "people"} registered
                </span>
              </div>
              
              {showDetails && event.organizer && (
                <div className="flex items-center gap-3 text-sm pt-2 border-t">
                  <div className="font-medium">Organizer:</div>
                  <span>{event.organizer}</span>
                </div>
              )}
            </div>
          </CardContent>
          
          {/* Action Button - Register or Show Registration Status */}
          <CardFooter className={cn(
            "pt-2",
            showDetails && "md:pr-8 md:pb-8"
          )}>
            {renderButton()}
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingEventCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  </motion.div>
);

// No Events Found Component
const NoEventsFound = ({ message = "There are no upcoming events at the moment. Please check back later." }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="col-span-full"
  >
    <div className="p-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-center">
      <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-blue-300 dark:text-blue-700" />
      <h3 className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-300">No Events Found</h3>
      <p className="text-blue-600 dark:text-blue-400 max-w-md mx-auto">
        {message}
      </p>
    </div>
  </motion.div>
);

// Main Events Page Component
export default function EventsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { events, registerForEvent, unregisterForEvent } = useEvents();
  
  // State for event details view
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  
  // Filtered events
  const filteredEvents = events.data ? events.data.filter(event => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter (assumes events have a category property)
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    
    // Time filter
    const eventStart = new Date(event.startDate);
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const followingMonth = addMonths(today, 1);
    const followingMonthEnd = addMonths(today, 2);
    
    let matchesTime = true;
    
    if (timeFilter === "today") {
      matchesTime = isSameDay(eventStart, today);
    } else if (timeFilter === "this-week") {
      matchesTime = isAfter(eventStart, today) && isBefore(eventStart, nextWeek);
    } else if (timeFilter === "this-month") {
      matchesTime = isAfter(eventStart, today) && isBefore(eventStart, nextMonth);
    } else if (timeFilter === "next-month") {
      matchesTime = isAfter(eventStart, nextMonth) && isBefore(eventStart, followingMonthEnd);
    } else if (timeFilter === "future") {
      matchesTime = isAfter(eventStart, today);
    }
    
    return matchesSearch && matchesCategory && matchesTime;
  }) : [];
  
  // Handle event registration
  const handleRegister = async (eventId: string) => {
    if (!session) {
      router.push("/login?callbackUrl=/events");
      return;
    }

    try {
      await registerForEvent.mutateAsync(eventId);
      toast({
        title: "Successfully registered!",
        description: "You have been registered for the event.",
        action: (
          <div className="p-1 rounded-full bg-green-500">
            <ThumbsUp className="h-4 w-4 text-white" />
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Handle event unregistration
  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterForEvent.mutateAsync(eventId);
      toast({
        title: "Successfully unregistered",
        description: "You have been unregistered from the event.",
      });
    } catch (error) {
      toast({
        title: "Unregistration failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTimeFilter("all");
  };
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || categoryFilter !== "all" || timeFilter !== "all";

  // Calculate filtered count
  const filteredCount = filteredEvents?.length || 0;
  const totalCount = events.data?.length || 0;

  return (
    <div className="min-h-screen py-10">
      {/* Hero Section */}
      <section className="relative mb-10 py-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay z-20"></div>
        
        <div className="container relative z-30">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-xl mb-6">
              Discover and register for exciting mentorship events and workshops
            </p>
            
            {!session && (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => router.push("/login?callbackUrl=/events")}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Sign In to Register for Events
              </Button>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-4">
            <div className="flex-grow space-y-2 w-full">
              <label htmlFor="search-events" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Search className="h-4 w-4" />
                Search Events
              </label>
              <div className="relative">
                <Input
                  id="search-events"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description or location..."
                  className="w-full pl-10"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PERIODS.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="px-3"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* Active filters summary */}
          {events.isSuccess && hasActiveFilters && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredCount} of {totalCount} events
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {categoryFilter !== "all" && <span> in {EVENT_CATEGORIES.find(c => c.value === categoryFilter)?.label}</span>}
              {timeFilter !== "all" && <span> for {TIME_PERIODS.find(t => t.value === timeFilter)?.label}</span>}
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        {events.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>
                {events.error instanceof Error
                  ? events.error.message
                  : "Failed to load events. Please try again later."}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => events.refetch()}
                className="ml-4"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Events Grid */}
        <div
          className={cn(
            "grid gap-6 grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-3",
            selectedEvent ? "xl:grid-cols-3" : "xl:grid-cols-4"
          )}
        >
          {/* Loading States */}
          <AnimatePresence>
            {events.isLoading &&
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <motion.div 
                    key={`loading-${index}`}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingEventCard />
                  </motion.div>
                ))}
          </AnimatePresence>

          {/* No Events State */}
          <AnimatePresence>
            {events.isSuccess && filteredEvents.length === 0 && (
              <NoEventsFound 
                message={
                  hasActiveFilters
                    ? "No events match your current filters. Try adjusting your search criteria or clearing filters."
                    : "There are no upcoming events at the moment. Please check back later."
                }
              />
            )}
          </AnimatePresence>

          {/* Event Cards */}
          <AnimatePresence>
            {events.isSuccess &&
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                  isRegistering={
                    registerForEvent.isPending ||
                    unregisterForEvent.isPending
                  }
                  isAuthenticated={!!session}
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                  showDetails={selectedEvent?.id === event.id}
                />
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}