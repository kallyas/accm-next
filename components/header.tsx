"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { ModeSwitcher } from "@/components/mode-switcher";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50/90 via-white/90 to-purple-50/90 dark:from-gray-900/90 dark:via-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {session ? (
              <UserNav />
            ) : (
              <div className="flex-end space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="hover:bg-blue-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white transition-all duration-300 border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
            <ModeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
