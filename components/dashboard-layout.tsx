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
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarLinks: SidebarLink[];
}

export function DashboardLayout({
  children,
  sidebarLinks,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    //remove all the padding added by the parent div
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r bg-background lg:block">
        <ScrollArea className="h-full py-6 pl-6 pr-4">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Dashboard
          </h2>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
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
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full py-6 pl-6 pr-4">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">
              Dashboard
            </h2>
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <div className="container mx-auto pl-5 py-6 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
