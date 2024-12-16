"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent } from "@/components/ui/pagination";

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

type NotificationsResponse = {
  notifications: Notification[];
  total: number;
  page: number;
  pageSize: number;
};

// API functions
const fetchNotifications = async ({
  userId,
  page = 1,
  pageSize = 10,
}: {
  userId: string;
  page?: number;
  pageSize?: number;
}): Promise<NotificationsResponse> => {
  const response = await fetch(
    `/api/notifications?userId=${userId}&page=${page}&pageSize=${pageSize}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
};

const markNotificationAsRead = async (notificationId: string) => {
  const response = await fetch(`/api/notifications/${notificationId}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return notificationId;
};

export function NotificationsList({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const queryClient = useQueryClient();

  // Fetch notifications query
  const { data, isLoading, isError, error } = useQuery<
    NotificationsResponse,
    Error
  >({
    queryKey: ["notifications", userId, page],
    queryFn: () => fetchNotifications({ userId, page, pageSize }),
    staleTime: 5000, // 5 seconds
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId) => {
      // Optimistically update the cache
      await queryClient.cancelQueries({
        queryKey: ["notifications", userId, page],
      });

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>([
          "notifications",
          userId,
          page,
        ]);

      if (previousNotifications) {
        queryClient.setQueryData(["notifications", userId, page], {
          ...previousNotifications,
          notifications: previousNotifications.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        });
      }

      return { previousNotifications };
    },
    onError: (err, newTodo, context) => {
      // Rollback the cache if mutation fails
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", userId, page],
          context.previousNotifications
        );
      }
    },
    onSettled: () => {
      // Refetch the notifications to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId, page],
      });
    },
  });

  // Loading and error states
  if (isLoading) return <p>Loading notifications...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  // No notifications
  if (!data?.notifications.length) {
    return <p>No notifications</p>;
  }

  return (
    <div className="space-y-4">
      {data.notifications.map((notification) => (
        <Card
          key={notification.id}
          className={notification.read ? "bg-muted" : ""}
        >
          <CardHeader>
            <CardTitle>{notification.title}</CardTitle>
            <CardDescription>{notification.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{notification.description}</p>
            {!notification.read && (
              <Button
                className="mt-2"
                variant="outline"
                onClick={() => markAsReadMutation.mutate(notification.id)}
                disabled={markAsReadMutation.isPending}
              >
                {markAsReadMutation.isPending ? "Marking..." : "Mark as read"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {data.total > pageSize && (
        <Pagination>
          <PaginationContent></PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
