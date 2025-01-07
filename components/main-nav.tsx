import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const gradientTextStyle =
    "bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent hover:from-blue-700 hover:to-teal-600";

  return (
    <div className="hidden md:flex items-center">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span
          className={cn("hidden font-bold sm:inline-block", gradientTextStyle)}
        >
          African Centre For Career Mentorship
        </span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="space-x-1">
          <NavigationMenuItem>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors"
                )}
              >
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/courses" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors"
                )}
              >
                Courses
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors">
              Services
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                {[
                  { href: "/mentors", label: "Mentors" },
                  { href: "/book-session", label: "Book Session" },
                  { href: "/services", label: "All Services" },
                  { href: "/cv-alignment", label: "CV Alignment" },
                  { href: "/scholarship-quest", label: "Scholarship Quest" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors w-full"
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors">
              Resources
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                {[
                  { href: "/events", label: "Events" },
                  { href: "/videos", label: "Videos" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/publications", label: "Publications" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors w-full"
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/payment-instructions" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors"
                )}
              >
                Payment
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/40 dark:hover:to-teal-900/40 transition-colors"
                )}
              >
                Contact
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
