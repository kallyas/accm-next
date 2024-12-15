"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

export function NotificationsList({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true);
      // In a real application, you would fetch notifications from an API
      const response = await fetch(`/api/notifications?userId=${userId}`);
      const data = await response.json();
      setNotifications(data);
      setIsLoading(false);
    }

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    // In a real application, you would update the notification status via an API
    await fetch(`/api/notifications/${notificationId}`, { method: "PATCH" });
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  if (isLoading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notification) => (
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
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
