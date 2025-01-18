import { EventInput, Event } from "@/types/event";
import {
  useQuery,
  useMutation,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await axios.get("/api/events");
    return response.data;
  } catch (error) {
    throw error instanceof AxiosError
      ? error
      : new Error("Failed to fetch events");
  }
};

const fetchUserEvents = async (): Promise<Event[]> => {
  const response = await axios.get("/api/user/events");
  return response.data;
};

const createEvent: MutationFunction<Event, EventInput> = async (event) => {
  try {
    const response = await axios.post("/api/events", event);
    return response.data;
  } catch (error) {
    throw error instanceof AxiosError
      ? error
      : new Error("Failed to create event");
  }
};

const updateEvent: MutationFunction<Event, Event> = async (event) => {
  try {
    const response = await axios.put(`/api/events/${event.id}`, event);
    return response.data;
  } catch (error) {
    throw error instanceof AxiosError
      ? error
      : new Error("Failed to update event");
  }
};

const deleteEvent: MutationFunction<void, string> = async (id) => {
  try {
    await axios.delete(`/api/events/${id}`);
  } catch (error) {
    throw error instanceof AxiosError
      ? error
      : new Error("Failed to delete event");
  }
};

const registerForEvent: MutationFunction<void, string> = async (eventId) => {
  try {
    await axios.post(`/api/events/${eventId}/register`);
  } catch (error) {
    throw error instanceof AxiosError
      ? error
      : new Error("Failed to register for event");
  }
};

const unregisterForEvent: MutationFunction<void, string> = async (eventId) => {
  try {
    await axios.post(`/api/events/${eventId}/unregister`);
  } catch (error) {
    throw error instanceof AxiosError
      ? error
      : new Error("Failed to unregister for event");
  }
};

// function to check if user is registered for a given event
const isRegisteredQuery = async ({
  queryKey,
}: {
  queryKey: string[];
}): Promise<boolean> => {
  const eventId = queryKey[1];
  try {
    const response = await axios.get(`/api/events/${eventId}/is-registered`);
    return response.data.isRegistered;
  } catch (error) {
    throw error instanceof AxiosError
      ? error
      : new Error("Failed to check registration status");
  }
};

export const useEvents = () => {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const userEventsQuery = useQuery({
    queryKey: ["user-events"],
    queryFn: fetchUserEvents,
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const registerForEventMutation = useMutation({
    mutationFn: registerForEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const unregisterForEventMutation = useMutation({
    mutationFn: unregisterForEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
    },
  });

  const useRegistrationStatus = (eventId: string) => {
    return useQuery({
      queryKey: ["registration-status", eventId],
      queryFn: () =>
        isRegisteredQuery({ queryKey: ["registration-status", eventId] }),
      enabled: !!eventId, // Only run the query if we have an eventId
    });
  };

  const useSendReminders = () => {
    return useMutation({
      mutationFn: async (userIds: string[]) => {
        const response = await axios.post("/api/admin/send-reminders", {
          userIds,
        });
        return response.data;
      },
    });
  }

  return {
    events: eventsQuery,
    createEvent: createEventMutation,
    updateEvent: updateEventMutation,
    deleteEvent: deleteEventMutation,
    registerForEvent: registerForEventMutation,
    unregisterForEvent: unregisterForEventMutation,
    isUserRegistered: useRegistrationStatus,
    userEvents: userEventsQuery,
    sendReminders: useSendReminders,
  };
};
