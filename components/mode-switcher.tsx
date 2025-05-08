"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Handle hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";

    // This will trigger the theme change animation
    document.documentElement.classList.add("theme-transition");

    // Set the theme after a brief delay to allow animation to start
    setTimeout(() => {
      setTheme(newTheme);
    }, 50);

    // Reset animation state after completion
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
      setIsAnimating(false);
    }, 1000);
  }, [resolvedTheme, setTheme, isAnimating]);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <Button
      variant="ghost"
      className="group relative h-9 w-9 px-0 overflow-hidden rounded-full"
      onClick={toggleTheme}
      disabled={isAnimating}
    >
      {/* Background color transition */}
      <span className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Animated sun/moon icons */}
      <div className="relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1], // Custom easing for smoother animation
              }}
              className="flex items-center justify-center"
            >
              <MoonIcon className="h-[18px] w-[18px] text-blue-600 dark:text-blue-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="flex items-center justify-center"
            >
              <SunIcon className="h-[18px] w-[18px] text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ripple effect animation */}
      {mounted && (
        <span className="sr-only">
          {isDark ? "Switch to light theme" : "Switch to dark theme"}
        </span>
      )}
    </Button>
  );
}
