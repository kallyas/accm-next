import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Star,
  MessageSquare,
  File,
  CreditCard,
  User,
} from "lucide-react";

export default async function UserDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "USER") {
    redirect("/admin");
  }

  const sidebarLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    // {
    //   href: "/dashboard/services",
    //   label: "Services",
    //   icon: <Star className="h-4 w-4" />,
    // },
    {
      href: "/dashboard/status",
      label: "Status",
      icon: <Star className="h-4 w-4" />,
    },
    {
      href: "/dashboard/events",
      label: "My Events",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      href: "/dashboard/cvs",
      label: "My CVs",
      icon: <File className="h-4 w-4" />,
    },
    {
      href: "/dashboard/personal-discovery",
      label: "Personal Discovery",
      icon: <User className="h-4 w-4" />,
    },
    {
      href: "/dashboard/progress",
      label: "Track Progress",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/dashboard/feedback",
      label: "Feedback",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      href: "/book-session",
      label: "Book Session",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/dashboard/testimonials",
      label: "Testimonials",
      icon: <Star className="h-4 w-4" />,
    },
    {
      href: "/dashboard/billing",
      label: "Billing",
      icon: <CreditCard className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>{children}</DashboardLayout>
  );
}
