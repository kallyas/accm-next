"use client";

import { format } from "date-fns";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Building,
  Calendar as CalendarIcon,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { toast } from "@/hooks/use-toast";
import { Event } from "@/types/event";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserEventListProps {
  events: Event[];
  queryKey: readonly unknown[];
}

function UserEventCard({
  event,
  index,
  onUnregister,
  isUnregistering,
}: {
  event: Event;
  index: number;
  onUnregister: () => void;
  isUnregistering: boolean;
}) {
  const isVirtual =
    event.location.toLowerCase().includes("virtual") ||
    event.location.toLowerCase().includes("online") ||
    event.location.toLowerCase().includes("zoom");

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group",
        index % 3 === 1 ? "md:translate-y-8" : "",
        index % 3 === 2 ? "md:-translate-y-4" : ""
      )}
    >
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF]">
        <div className="relative aspect-[16/10] overflow-hidden">
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A1B4B]/5">
              <div className="flex h-full items-center justify-center">
                <CalendarIcon className="h-12 w-12 text-[#1A1B4B]/40" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B4B]/60 via-[#1A1B4B]/10 to-transparent" />
          <div className="absolute top-3 left-3">
              <Badge className="bg-[#1A1B4B] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-[#FFFFFF]">
                Registered
              </Badge>
          </div>
          {isVirtual && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-[#26A649] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-[#FFFFFF]">
                Virtual
              </Badge>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-base font-semibold uppercase leading-tight">
            {event.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#1A1B4B]/75">
            {event.description}
          </p>
          <div className="mt-4 space-y-2.5 border-t border-[#1A1B4B]/15 pt-4">
            <div className="flex items-start gap-2.5">
              <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1A1B4B]/75" />
              <div className="text-sm leading-6 text-[#1A1B4B]/75">
                <span className="font-medium">
                  {format(new Date(event.startDate), "EEEE, MMM d, yyyy")}
                </span>
                <span className="text-[#1A1B4B]/55">
                  {" "}at {format(new Date(event.startDate), "h:mm a")}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              {isVirtual ? (
                <Building className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1A1B4B]/75" />
              ) : (
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1A1B4B]/75" />
              )}
              <span className="line-clamp-1 text-sm leading-6 text-[#1A1B4B]/75">
                {event.location}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 flex-shrink-0 text-[#1A1B4B]/75" />
              <span className="text-sm leading-6 text-[#1A1B4B]/75">
                {event.registeredCount}{" "}
                {event.registeredCount === 1 ? "person" : "people"} attending
              </span>
            </div>
          </div>
          <div className="mt-5">
            <Button
              onClick={onUnregister}
              disabled={isUnregistering}
              className="h-10 w-full rounded-none border border-[#1A1B4B]/20 bg-[#FFFFFF] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10 hover:text-[#1A1B4B]"
            >
              {isUnregistering ? "Unregistering..." : "Unregister"}
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function UserEventList({ events, queryKey }: UserEventListProps) {
  const { unregisterForEvent } = useEvents();
  const queryClient = useQueryClient();

  const handleUnregister = async (eventId: string) => {
    const previousEvents = queryClient.getQueryData(queryKey) as Event[];

    queryClient.setQueryData(queryKey, (old: Event[] | undefined) =>
      (old || []).filter((event) => event.id !== eventId)
    );

    try {
      await unregisterForEvent.mutateAsync(eventId);
      toast({ title: "Successfully unregistered from the event" });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
    } catch {
      queryClient.setQueryData(queryKey, previousEvents);
      toast({
        title: "Error",
        description: "Failed to unregister from the event",
        variant: "destructive",
      });
    }
  };

  if (events.length === 0) {
    return (
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF] p-12 text-center">
        <CalendarIcon className="mx-auto h-12 w-12 text-[#1A1B4B]/35" />
        <h3 className="mt-4 text-lg font-semibold uppercase text-[#1A1B4B]">No events yet</h3>
        <p className="mt-2 text-sm leading-6 text-[#1A1B4B]/70">
          You have not registered for any events. Browse upcoming events to find
          opportunities that match your interests.
        </p>
        <Link href="/events">
          <Button className="mt-6 h-10 rounded-none bg-[#1A1B4B] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#FFFFFF] hover:bg-[#1A1B4B]/90">
            Browse events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <UserEventCard
          key={event.id}
          event={event}
          index={index}
          onUnregister={() => handleUnregister(event.id)}
          isUnregistering={unregisterForEvent.isPending}
        />
      ))}
    </div>
  );
}
