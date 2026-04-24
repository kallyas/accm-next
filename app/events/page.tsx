"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Check,
  UserPlus,
  CalendarDays,
  Sparkles,
  Building,
  X,
  ChevronRight,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Users2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore, isSameDay, addMonths } from "date-fns";
import axios from "axios";

const useRegistrationStatus = (eventId: string) => {
  return useQuery({
    queryKey: ["registration-status", eventId],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}/is-registered`);
        return response.data.isRegistered;
      } catch {
        return false;
      }
    },
    enabled: !!eventId,
  });
};

const EVENT_CATEGORIES = [
  { value: "all", label: "All Events" },
  { value: "workshop", label: "Workshops" },
  { value: "seminar", label: "Seminars" },
  { value: "networking", label: "Networking" },
  { value: "conference", label: "Conferences" },
  { value: "training", label: "Training" },
];

const TIME_PERIODS = [
  { value: "all", label: "Any Time" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "next-month", label: "Next Month" },
  { value: "future", label: "Future Events" },
];

const getEventDateFormatted = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return (
      <>
        <span className="font-medium">{format(start, "EEEE, MMMM d, yyyy")}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {" "}
          {format(start, "h:mm a")} - {format(end, "h:mm a")}
        </span>
      </>
    );
  }

  return (
    <>
      <span className="font-medium">From: {format(start, "EEEE, MMM d")}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {" at "}
        {format(start, "h:mm a")}
      </span>
      <br />
      <span className="font-medium">To: {format(end, "EEEE, MMM d")}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {" at "}
        {format(end, "h:mm a")}
      </span>
    </>
  );
};

const isEventSoon = (startDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const diffTime = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
};

const isEventPopular = (registeredCount: number) => {
  return registeredCount >= 20;
};

const formatLocation = (location: string) => {
  const isVirtual =
    location.toLowerCase().includes("virtual") ||
    location.toLowerCase().includes("online") ||
    location.toLowerCase().includes("zoom");

  return {
    text: location,
    isVirtual,
  };
};

function EventCard({
  event,
  onRegister,
  onUnregister,
  isRegistering,
  isAuthenticated,
  onClick,
  showDetails = false,
  index,
}: {
  event: Event;
  onRegister: (eventId: string) => void;
  onUnregister: (eventId: string) => void;
  isRegistering: boolean;
  isAuthenticated: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  index: number;
}) {
  const router = useRouter();
  const { data: isRegistered = false, isLoading: isCheckingRegistration } =
    useRegistrationStatus(event.id);

  const location = formatLocation(event.location);
  const soon = isEventSoon(event.startDate);
  const popular = isEventPopular(event.registeredCount);

  const handleLoginRedirect = () => {
    router.push("/login?callbackUrl=/events");
  };

  const renderButton = () => {
    if (!isAuthenticated) {
      return (
        <Button
          className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          onClick={handleLoginRedirect}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Login to register
        </Button>
      );
    }

    if (isCheckingRegistration) {
      return (
        <Button className="h-11 w-full rounded-none" disabled>
          <Skeleton className="mr-2 h-4 w-4 rounded-full" />
          Checking...
        </Button>
      );
    }

    if (isRegistered) {
      return (
        <Button
          className="h-11 w-full rounded-none border border-gray-300 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => onUnregister(event.id)}
          disabled={isRegistering}
          variant="outline"
        >
          {isRegistering ? (
            <Skeleton className="mr-2 h-4 w-4 rounded-full animate-pulse" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Registered
        </Button>
      );
    }

    return (
      <Button
        className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        onClick={(e) => {
          e.stopPropagation();
          onRegister(event.id);
        }}
        disabled={isRegistering}
      >
        {isRegistering ? (
          <>
            <Skeleton className="mr-2 h-4 w-4 rounded-full animate-spin" />
            Registering...
          </>
        ) : (
          <>
            <CalendarDays className="mr-2 h-4 w-4" />
            Register now
          </>
        )}
      </Button>
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group cursor-pointer",
        index % 3 === 1 ? "md:translate-y-8" : "",
        index % 3 === 2 ? "md:-translate-y-4" : ""
      )}
      onClick={onClick}
    >
      <div className="border border-gray-300 bg-white/70 dark:border-gray-800 dark:bg-[#171b1d]">
        <div className="relative aspect-[16/10] overflow-hidden">
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#ebe7df] dark:bg-[#121518]">
              <div className="flex h-full items-center justify-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {soon && (
              <Badge className="bg-amber-600 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
                <Clock className="mr-1 h-3 w-3" />
                Soon
              </Badge>
            )}
            {popular && (
              <Badge className="bg-purple-600 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
                <Sparkles className="mr-1 h-3 w-3" />
                Popular
              </Badge>
            )}
            {location.isVirtual && (
              <Badge className="bg-green-600 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
                Virtual
              </Badge>
            )}
            {isRegistered && (
              <Badge className="bg-gray-900 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white dark:bg-gray-100 dark:text-gray-900">
                <Check className="mr-1 h-3 w-3" />
                Registered
              </Badge>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold uppercase leading-tight">
            {event.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300 line-clamp-2">
            {event.description}
          </p>
          <div className="mt-4 space-y-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-start gap-2.5">
              <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
              <span className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                {getEventDateFormatted(event.startDate, event.endDate)}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              {location.isVirtual ? (
                <Building className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
              ) : (
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
              )}
              <span className="text-sm leading-6 text-gray-700 dark:text-gray-300 line-clamp-1">
                {event.location}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
              <span className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                {event.registeredCount}{" "}
                {event.registeredCount === 1 ? "person" : "people"} registered
              </span>
            </div>
          </div>
          <div className="mt-5">{renderButton()}</div>
        </div>
      </div>
    </motion.article>
  );
}

function LoadingEventCard() {
  return (
    <div className="border border-gray-300 bg-white/70 dark:border-gray-800 dark:bg-[#171b1d]">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-4 h-4 w-1/2" />
        <Skeleton className="mt-5 h-11 w-full" />
      </div>
    </div>
  );
}

function NoEventsFound({
  message = "There are no upcoming events at the moment. Please check back later.",
}: {
  message?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="col-span-full border border-gray-300 bg-white/70 p-12 text-center dark:border-gray-800 dark:bg-[#171b1d]"
    >
      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
      <h3 className="mt-4 text-lg font-semibold uppercase">No events found</h3>
      <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </motion.div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { events, registerForEvent, unregisterForEvent } = useEvents();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const filteredEvents = events.data
    ? events.data.filter((event) => {
        const matchesSearch =
          searchTerm === "" ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" || event.category === categoryFilter;

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
          matchesTime =
            isAfter(eventStart, today) && isBefore(eventStart, nextMonth);
        } else if (timeFilter === "next-month") {
          matchesTime =
            isAfter(eventStart, nextMonth) &&
            isBefore(eventStart, followingMonthEnd);
        } else if (timeFilter === "future") {
          matchesTime = isAfter(eventStart, today);
        }

        return matchesSearch && matchesCategory && matchesTime;
      })
    : [];

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

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTimeFilter("all");
  };

  const hasActiveFilters =
    searchTerm !== "" || categoryFilter !== "all" || timeFilter !== "all";

  const filteredCount = filteredEvents?.length || 0;
  const totalCount = events.data?.length || 0;

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                Upcoming events
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.1vw,3.7rem)] font-semibold uppercase leading-[0.98]"
              >
                Events that shape careers.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                Workshops, masterclasses, and networking events designed to
                accelerate your professional growth.
              </motion.p>
              {session && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="mt-7"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                    You have{" "}
                    {events.data?.filter((e) => {
                      const start = new Date(e.startDate);
                      return isAfter(start, new Date());
                    }).length || 0}
                    {" "}upcoming events
                  </p>
                </motion.div>
              )}
            </div>
            <div className="relative min-h-[22rem] border-t border-gray-300 dark:border-gray-800 lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-[#171b1d]">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <CalendarDays className="mx-auto h-12 w-12 text-gray-600 dark:text-gray-500" />
                    <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                      Live & virtual
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Hybrid event formats
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-8 dark:border-gray-800 md:py-10">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="search-events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="border-gray-300 bg-white pl-10 dark:border-gray-700 dark:bg-[#171b1d]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] border-gray-300 bg-white dark:border-gray-700 dark:bg-[#171b1d]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[150px] border-gray-300 bg-white dark:border-gray-700 dark:bg-[#171b1d]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_PERIODS.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-10 rounded-none border border-gray-300 px-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          {events.isSuccess && hasActiveFilters && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredCount} of {totalCount} events
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {categoryFilter !== "all" && (
                <span>
                  {" "}in{" "}
                  {EVENT_CATEGORIES.find((c) => c.value === categoryFilter)?.label}
                </span>
              )}
              {timeFilter !== "all" && (
                <span>
                  {" "}for{" "}
                  {TIME_PERIODS.find((t) => t.value === timeFilter)?.label}
                </span>
              )}
            </p>
          )}
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          {events.isError && (
            <div className="mb-8 border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-300">
                Failed to load events.{" "}
                <button
                  onClick={() => events.refetch()}
                  className="underline"
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {events.isLoading &&
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <LoadingEventCard key={`loading-${index}`} />
                  ))}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
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

            <AnimatePresence mode="popLayout">
              {events.isSuccess &&
                filteredEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    isRegistering={
                      registerForEvent.isPending || unregisterForEvent.isPending
                    }
                    isAuthenticated={!!session}
                    onClick={() =>
                      setSelectedEvent(
                        selectedEvent?.id === event.id ? null : event
                      )
                    }
                    showDetails={selectedEvent?.id === event.id}
                    index={index}
                  />
                ))}
            </AnimatePresence>
          </div>
        </section>

        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Stay connected
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Never miss an opportunity.
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                Subscribe to our newsletter to get notified about upcoming
                events, workshops, and mentorship opportunities.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 bg-[#ece8df] px-6 py-10 dark:bg-[#0f1315] sm:px-10">
              <Button className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                Subscribe
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-11 w-full rounded-none border border-gray-300 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Explore services
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}