import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  CreditCard,
  FileText,
  Download,
  UsersIcon,
  MessageSquare,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login`);
  }

  if (session?.user?.role !== "USER") {
    redirect(`/`);
  }

  const sidebarLinks = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      href: "/admin/events",
      label: "Events",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      href: "/admin/plans",
      label: "Plans",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      href: "/admin/publications",
      label: "Publications",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/admin/blogs",
      label: "Blogs",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: "/admin/resources",
      label: "Resources",
      icon: <Download className="h-4 w-4" />,
    },
    {
      href: "/admin/team",
      label: "Team Members",
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      href: "/admin/mentors",
      label: "Mentors",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>{children}</DashboardLayout>
  );
}