"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavigationItem {
  title: string;
  href?: string;
  submenu?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Services",
    submenu: [
      { title: "Mentors", href: "/mentors" },
      { title: "Book Session", href: "/book-session" },
      { title: "All Services", href: "/services" },
      { title: "CV Alignment", href: "/cv-alignment" },
      { title: "Scholarship Quest", href: "/scholarship-quest" },
    ],
  },
  {
    title: "Resources",
    submenu: [
      { title: "Events", href: "/events" },
      { title: "Videos", href: "/videos" },
      { title: "Gallery", href: "/gallery" },
      { title: "Publications", href: "/publications" },
    ],
  },
  {
    title: "Payment",
    href: "/payment-instructions",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px]">
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-6 px-6">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setOpen(false)}>
              <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                ACCM
              </h2>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-4 py-3 text-left font-medium",
                      openSubmenu === item.title
                        ? "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {item.title}
                    <motion.div
                      animate={{ rotate: openSubmenu === item.title ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openSubmenu === item.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 pl-2 border-l border-gray-200 dark:border-gray-700 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href || "#"}
                              className={cn(
                                "flex items-center justify-between rounded-md px-4 py-2.5 text-sm",
                                pathname === subItem.href
                                  ? "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40 text-blue-700 dark:text-blue-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                              )}
                            >
                              {subItem.title}
                              <ChevronRight className="h-4 w-4 opacity-50" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center justify-between rounded-md px-4 py-3 font-medium",
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {item.title}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
