"use client";

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
  sectionTitle?: string;
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
  sidebarSections?: SidebarSection[];
}

export function DashboardLayout({
  children,
  sidebarLinks,
  sidebarSections,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderNavigation = (closeSidebar?: () => void) => {
    if (sidebarSections?.length) {
      return (
        <>
          {sidebarSections.map((section, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="mb-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#1A1B4B]/50">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-xs uppercase tracking-wider transition-colors",
                        pathname === link.href
                          ? "bg-[#1A1B4B]/10 text-[#1A1B4B]"
                          : "text-[#1A1B4B]/70 hover:bg-[#1A1B4B]/10 hover:text-[#1A1B4B]"
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

    return (
      <div className="space-y-1">
        {sidebarLinks.map((link) => (
          <div key={link.href}>
            {link.sectionTitle && (
              <h3 className="mt-4 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#1A1B4B]/50">
                {link.sectionTitle}
              </h3>
            )}
            <Link href={link.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-xs uppercase tracking-wider transition-colors",
                  pathname === link.href
                    ? "bg-[#1A1B4B]/10 text-[#1A1B4B]"
                    : "text-[#1A1B4B]/70 hover:bg-[#1A1B4B]/10 hover:text-[#1A1B4B]"
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
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r border-[#1A1B4B]/15 bg-[#FFFFFF] lg:block">
        <ScrollArea className="h-full py-6 pl-6 pr-4">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border border-[#1A1B4B] bg-[#1A1B4B]">
              <span className="text-lg font-semibold uppercase text-[#FFFFFF]">A</span>
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1A1B4B]">
              ACCM
            </span>
          </div>
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
            <Menu className="h-6 w-6 text-[#1A1B4B]" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-[#FFFFFF] p-0">
          <ScrollArea className="h-full py-6 pl-6 pr-4">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center border border-[#1A1B4B] bg-[#1A1B4B]">
                <span className="text-lg font-semibold uppercase text-[#FFFFFF]">A</span>
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#1A1B4B]">
                ACCM
              </span>
            </div>
            <nav>{renderNavigation(() => setIsSidebarOpen(false))}</nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex-1 bg-[#FFFFFF]">
        <div className="container mx-auto pl-5 py-6 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
