import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Mentors",
    href: "/mentors",
  },
  {
    title: "Book Session",
    href: "/book-session",
  },
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "CV Alignment",
    href: "/cv-alignment",
  },
  {
    title: "Events",
    href: "/events",
  },
  {
    title: "Videos",
    href: "/videos",
  },
  {
    title: "Gallery",
    href: "/gallery",
  },
  {
    title: "Publications",
    href: "/publications",
  },
  {
    title: "Payment",
    href: "/payment-instructions",
  },
  {
    title: "Blog",
    href: "/blogs",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-2 py-1 text-lg"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
