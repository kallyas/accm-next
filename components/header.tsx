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
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
            : "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
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
                    className="flex items-center space-x-2"
                  >
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative group overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/40 to-blue-100/0 group-hover:via-blue-100/60 dark:from-blue-900/0 dark:via-blue-900/40 dark:to-blue-900/0 dark:group-hover:via-blue-900/60 opacity-0 group-hover:opacity-100 z-0 transition-opacity transform -translate-x-full group-hover:translate-x-full duration-1000"></span>
                        <span className="relative z-10 flex items-center">
                          <LogIn className="mr-1 h-4 w-4" />
                          Login
                        </span>
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="relative overflow-hidden shadow-md group">
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:from-blue-700 group-hover:to-teal-600 z-0"></span>
                        <span className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 z-10"></span>
                        <span className="relative z-20 flex items-center">
                          <UserPlus className="mr-1 h-4 w-4" />
                          Get Started
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
