"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

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

export function UserNav() {
  const { data: session } = useSession();

  const { data, isLoading, isError, error } = useQuery<
    NotificationsResponse,
    Error
  >({
    queryKey: ["notifications", session!.user!.id, 1],
    queryFn: () => fetchNotifications({ userId: session!.user!.id }),
    staleTime: 5000, // 5 seconds
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <BellIcon className="h-5 w-5" />
            {data?.notifications.some((notification) => !notification.read) && (
              <span className="absolute top-0 right-0 inline-block h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">Notifications</p>
              <Button variant="ghost" size="sm">
                Mark all as read
              </Button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isLoading && <DropdownMenuItem>Loading...</DropdownMenuItem>}
            {data?.notifications.map((notification) => (
              <DropdownMenuItem key={notification.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm leading-none">{notification.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {notification.date}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href="/dashboard/notifications">
            <DropdownMenuItem>
              View all notifications
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/avatars/01.png"
                alt={session?.user?.name || ""}
              />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session?.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/dashboard">
              <DropdownMenuItem>
                Dashboard
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/profile">
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/settings">
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
