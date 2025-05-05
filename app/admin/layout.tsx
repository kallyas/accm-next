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
  MessageSquare,
  CalendarCheck,
  Library,
  BookMarked,
  BookCopy,
  Settings,
  BarChart,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Define sidebar link type
type SidebarLink = {
  href: string;
  label: string;
  icon: JSX.Element;
};

// Define sidebar section type
type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user has admin role
  if (session?.user?.role !== "ADMIN") {
    redirect(`/dashboard`);
  }

  // Organize sidebar links into logical sections
  const sidebarSections: SidebarSection[] = [
    {
      title: "Overview",
      links: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          href: "/admin/analytics",
          label: "Analytics",
          icon: <BarChart className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Events",
      links: [
        {
          href: "/admin/events",
          label: "Events",
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          href: "/admin/user-events",
          label: "User Events",
          icon: <CalendarCheck className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Payments",
      links: [
        {
          href: "/admin/plans",
          label: "Plans",
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          href: "/admin/subscriptions",
          label: "Subscriptions",
          icon: <CreditCard className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Content",
      links: [
        {
          href: "/admin/publications",
          label: "Publications",
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          href: "/admin/courses",
          label: "Courses",
          icon: <Library className="h-4 w-4" />,
        },
        {
          href: "/admin/categories",
          label: "Categories",
          icon: <BookMarked className="h-4 w-4" />,
        },
        {
          href: "/admin/career-assessments",
          label: "Career Assessments",
          icon: <BookCopy className="h-4 w-4" />,
        },
        {
          href: "/admin/testimonials",
          label: "Testimonials",
          icon: <MessageSquare className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Users",
      links: [
        {
          href: "/admin/users",
          label: "All Users",
          icon: <Users className="h-4 w-4" />,
        },
        // Uncomment these when ready to implement
        // {
        //   href: "/admin/team",
        //   label: "Team Members",
        //   icon: <Users className="h-4 w-4" />,
        // },
        // {
        //   href: "/admin/mentors",
        //   label: "Mentors",
        //   icon: <Users className="h-4 w-4" />,
        // },
      ],
    },
    // Add additional sections as needed
    // {
    //   title: "Resources",
    //   links: [
    //     {
    //       href: "/admin/resources",
    //       label: "Resources",
    //       icon: <Download className="h-4 w-4" />,
    //     },
    //   ],
    // },
    {
      title: "System",
      links: [
        {
          href: "/admin/settings",
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
  ];

  // Flatten sections into links for the component
  const sidebarLinks = sidebarSections.flatMap(section => 
    section.links.map((link, index) => ({
      ...link,
      // Add section title as a divider before the first link in each section
      sectionTitle: index === 0 ? section.title : undefined
    }))
  );

  return (
    <DashboardLayout 
      sidebarLinks={sidebarLinks}
      sidebarSections={sidebarSections}
    >
      {children}
    </DashboardLayout>
  );
}