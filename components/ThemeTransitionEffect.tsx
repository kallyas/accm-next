"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeTransitionEffect() {
  const { resolvedTheme } = useTheme();
  const [prevTheme, setPrevTheme] = useState<string | null>(null);
  const [themeChangePosition, setThemeChangePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Listen for theme changes
  useEffect(() => {
    if (prevTheme && prevTheme !== resolvedTheme && themeChangePosition) {
      // Create the overlay element
      const overlay = document.createElement("div");
      overlay.className = "theme-transition-overlay";
      document.body.appendChild(overlay);

      // Set CSS variables for the animation position
      document.documentElement.style.setProperty(
        "--theme-change-x",
        `${themeChangePosition.x}px`
      );
      document.documentElement.style.setProperty(
        "--theme-change-y",
        `${themeChangePosition.y}px`
      );
      document.documentElement.style.setProperty(
        "--theme-change-color",
        resolvedTheme === "dark"
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)"
      );

      // Remove the overlay after animation completes
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 1000);
    }

    // Track mouse position for next theme change
    const handleMouseMove = (e: MouseEvent) => {
      setThemeChangePosition({ x: e.clientX, y: e.clientY });
    };

    // If no position is set yet, default to center
    if (!themeChangePosition) {
      setThemeChangePosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    setPrevTheme(resolvedTheme);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [resolvedTheme, prevTheme, themeChangePosition]);

  return null; // This component doesn't render anything
}
