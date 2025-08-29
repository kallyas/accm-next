"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { ModeSwitcher } from "@/components/mode-switcher";
import { UserPlus, LogIn } from "lucide-react";
import { ThemeTransitionEffect } from "./ThemeTransitionEffect";

export function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled (for shadow/background effect)
      if (currentScrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Auto-hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <ThemeTransitionEffect />
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <AnimatePresence mode="wait">
                {session ? (
                  <motion.div
                    key="user-nav"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserNav />
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-buttons"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3"
                  >
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full px-4 py-2 transition-all duration-300"
                      >
                        <span className="flex items-center font-medium text-gray-700 dark:text-gray-300">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </span>
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button 
                        size="sm" 
                        className="relative group bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6 py-2 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <span className="flex items-center font-medium">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Start Learning
                        </span>
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </motion.header>
    </>
  );
}
