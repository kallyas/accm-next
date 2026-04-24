"use client";

import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 12);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ThemeTransitionEffect />
      <motion.header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "border-[#1A1B4B]/20 bg-[#f7f5f1]/95 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] backdrop-blur-md  "
            : "border-[#1A1B4B]/20 bg-[#f7f5f1]/88 backdrop-blur-sm  "
        )}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div className="mx-auto grid h-[4.7rem] w-full max-w-[88rem] grid-cols-[1fr_auto] items-stretch px-3 sm:px-6 lg:grid-cols-[minmax(15rem,20rem)_1fr_auto] lg:px-8">
          <Link
            href="/"
            className="hidden border-r border-[#1A1B4B]/20 pr-6 lg:flex lg:items-center "
          >
            <div className="space-y-1">
              <p className="text-[0.57rem] font-semibold uppercase tracking-[0.28em] text-[#1A1B4B]/70 ">
                East Africa
              </p>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.15em] text-[#1A1B4B] ">
                African Centre for Career Mentorship
              </p>
            </div>
          </Link>

          <div className="flex items-center justify-start gap-3 pl-0 lg:justify-center lg:pl-5">
            <MobileNav />
            <Link
              href="/"
              className="hidden border-r border-[#1A1B4B]/20 pr-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#1A1B4B] md:inline-flex lg:hidden  "
            >
              ACCM
            </Link>
            <MainNav />
          </div>

          <div className="flex items-center justify-end gap-2 border-l border-[#1A1B4B]/20 pl-3 sm:pl-4 ">
            <AnimatePresence mode="wait">
              {session ? (
                <motion.div
                  key="user-nav"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserNav />
                </motion.div>
              ) : (
                <motion.div
                  key="auth-buttons"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  className="hidden items-center gap-2 sm:flex"
                >
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-none border border-[#1A1B4B]/20 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#1A1B4B] hover:bg-[#1A1B4B]/10   "
                    >
                      <LogIn className="mr-1.5 h-3.5 w-3.5" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="h-9 rounded-none bg-[#1A1B4B]/10 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#FFFFFF] hover:bg-[#1A1B4B]/10   "
                    >
                      <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                      Start
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <ModeSwitcher />
          </div>
        </div>
      </motion.header>
    </>
  );
}
