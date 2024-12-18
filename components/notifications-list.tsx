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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Bell, Check, Dot, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
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
  if (isLoading)
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Bell className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Loading notifications</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we fetch your notifications
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  if (isError)
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Bell className="h-12 w-12 text-muted-foreground/50" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Failed to load notifications
            </h3>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </Card>
    );

  return (
    <div className="space-y-6">
      {data?.notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Bell className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No notifications yet</h3>
              <p className="text-sm text-muted-foreground">
                When you receive notifications, they will appear here
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-colors duration-200",
                !notification.read && "border-primary/20 bg-primary/5"
              )}
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {notification.title}
                    </CardTitle>
                    {!notification.read && (
                      <Dot className="h-6 w-6 fill-primary text-primary animate-pulse" />
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 hover:bg-primary/10"
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    disabled={markAsReadMutation.isPending}
                  >
                    {markAsReadMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Marking
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Mark as read
                      </span>
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {notification.description} 
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.total! > pageSize && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              {page > 1 && <PaginationPrevious href="#" />}
            </PaginationItem>
            {/* Add page numbers based on your total pages */}
            <PaginationItem>
              <span>{page}</span>
            </PaginationItem>
            <PaginationItem>
              {page < Math.ceil(data!.total / pageSize) && (
                <PaginationNext href="#" />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
