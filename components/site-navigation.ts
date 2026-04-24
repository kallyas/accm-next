export interface NavigationItem {
  title: string;
  href?: string;
  submenu?: {
    title: string;
    href: string;
    description?: string;
  }[];
}

export const navigationItems: NavigationItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Courses", href: "/courses" },
  {
    title: "Services",
    submenu: [
      {
        title: "Mentors",
        href: "/mentors",
        description: "Connect with experienced career mentors",
      },
      {
        title: "Book Session",
        href: "/book-session",
        description: "Schedule a one-on-one mentoring session",
      },
      {
        title: "All Services",
        href: "/services",
        description: "Browse our complete catalog of services",
      },
      {
        title: "CV Alignment",
        href: "/cv-alignment",
        description: "Professional resume improvement service",
      },
      {
        title: "Scholarship Quest",
        href: "/scholarship-quest",
        description: "Find and apply for scholarships with expert guidance",
      },
    ],
  },
  {
    title: "Resources",
    submenu: [
      {
        title: "Events",
        href: "/events",
        description: "Upcoming workshops, webinars and networking opportunities",
      },
      {
        title: "Videos",
        href: "/videos",
        description: "Educational and inspirational video content",
      },
      {
        title: "Gallery",
        href: "/gallery",
        description: "Photos from our events and community activities",
      },
      {
        title: "Publications",
        href: "/publications",
        description: "Research papers, guides and educational materials",
      },
      {
        title: "FAQ",
        href: "/faq",
        description: "Frequently asked questions and guidance from mentorship sessions",
      },
    ],
  },
  { title: "Payment", href: "/payment-instructions" },
  { title: "Contact", href: "/contact" },
];
