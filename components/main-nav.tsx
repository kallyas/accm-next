"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronRight } from "lucide-react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  // Define menu structure for better organization
  const menuItems = [
    {
      label: "About",
      href: "/about",
      type: "link"
    },
    {
      label: "Courses",
      href: "/courses",
      type: "link"
    },
    {
      label: "Services",
      type: "dropdown",
      items: [
        { href: "/mentors", label: "Mentors", description: "Connect with experienced career mentors" },
        { href: "/book-session", label: "Book Session", description: "Schedule a one-on-one mentoring session" },
        { href: "/services", label: "All Services", description: "Browse our complete catalog of services" },
        { href: "/cv-alignment", label: "CV Alignment", description: "Professional resume improvement service" },
        { href: "/scholarship-quest", label: "Scholarship Quest", description: "Find and apply for scholarships with expert guidance" },
      ]
    },
    {
      label: "Resources",
      type: "dropdown",
      items: [
        { href: "/events", label: "Events", description: "Upcoming workshops, webinars and networking opportunities" },
        { href: "/videos", label: "Videos", description: "Educational and inspirational video content" },
        { href: "/gallery", label: "Gallery", description: "Photos from our events and community activities" },
        { href: "/publications", label: "Publications", description: "Research papers, guides and educational materials" },
      ]
    },
    {
      label: "Payment",
      href: "/payment-instructions",
      type: "link"
    },
    {
      label: "Contact",
      href: "/contact",
      type: "link"
    },
  ];

  return (
    <div className="hidden md:flex items-center">
      <Link href="/" className="mr-6 flex items-center space-x-2 relative group">
        <motion.div 
          className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-100/50 to-teal-100/50 dark:from-blue-900/20 dark:to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          animate={{ opacity: pathname === "/" ? 1 : 0 }}
        />
        <span className="relative font-bold sm:inline-block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-teal-600 transition-all duration-300">
          African Centre For Career Mentorship
        </span>
      </Link>
      
      <NavigationMenu>
        <NavigationMenuList className="space-x-1">
          {menuItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.type === "link" ? (
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "group relative transition-colors",
                      pathname === item.href && "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40",
                    )}
                    onMouseEnter={() => setHoveredPath(item.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                  >
                    <motion.span
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40 opacity-0"
                      initial={false}
                      animate={{ 
                        opacity: (hoveredPath === item.href || pathname === item.href) ? 1 : 0 
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </NavigationMenuLink>
                </Link>
              ) : (
                <>
                  <NavigationMenuTrigger 
                    className={cn(
                      "group relative transition-colors",
                      pathname && item.items?.some(subitem => pathname === subitem.href) && 
                      "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40"
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                      {item.items.map((subitem) => (
                        <li key={subitem.href} className="row-span-1">
                          <Link href={subitem.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "flex flex-col gap-1 rounded-md p-3 w-full leading-none no-underline outline-none transition-colors hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40",
                                pathname === subitem.href && "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{subitem.label}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {subitem.description}
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}