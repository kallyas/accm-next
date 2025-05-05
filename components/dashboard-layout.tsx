"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
  sectionTitle?: string; // Optional section title for the first item in each section
}

interface SidebarSection {
  title: string;
  links: {
    href: string;
    label: string;
    icon: ReactNode;
  }[];
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarLinks: SidebarLink[];
  sidebarSections?: SidebarSection[]; // Optional sections-based navigation
}

export function DashboardLayout({
  children,
  sidebarLinks,
  sidebarSections,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const gradientBackground =
    "bg-gradient-to-b from-background via-background to-blue-50/20 dark:from-background dark:via-background dark:to-blue-950/10";
  const activeGradient =
    "bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-400/10 dark:via-blue-400/5 dark:to-transparent hover:from-blue-500/15 hover:via-blue-500/10 hover:to-transparent";
  const buttonHoverGradient =
    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 dark:hover:to-transparent";

  // Function to render navigation items
  const renderNavigation = (closeSidebar?: () => void) => {
    // If we have sections, render them
    if (sidebarSections?.length) {
      return (
        <>
          {sidebarSections.map((section, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="mb-6">
              <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-all duration-200",
                        pathname === link.href
                          ? activeGradient
                          : buttonHoverGradient
                      )}
                      onClick={closeSidebar}
                    >
                      {link.icon}
                      <span className="ml-3">{link.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </>
      );
    }

    // Otherwise, fall back to flat list with optional section titles
    return (
      <div className="space-y-1">
        {sidebarLinks.map((link, index) => (
          <div key={link.href}>
            {link.sectionTitle && (
              <h3 className="mt-4 mb-2 px-4 text-sm font-medium text-muted-foreground">
                {link.sectionTitle}
              </h3>
            )}
            <Link href={link.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  pathname === link.href
                    ? activeGradient
                    : buttonHoverGradient
                )}
                onClick={closeSidebar}
              >
                {link.icon}
                <span className="ml-3">{link.label}</span>
              </Button>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn("hidden w-64 border-r lg:block", gradientBackground)}
      >
        <ScrollArea className="h-full py-6 pl-6 pr-4">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <nav>{renderNavigation()}</nav>
        </ScrollArea>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className={cn("w-64 p-0", gradientBackground)}
        >
          <ScrollArea className="h-full py-6 pl-6 pr-4">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <nav>{renderNavigation(() => setIsSidebarOpen(false))}</nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex-1 inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto pl-5 py-6 lg:py-10">{children}</div>
      </div>
    </div>
  );
}