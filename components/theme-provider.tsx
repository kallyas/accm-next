"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <>
      <style jsx global>{`
        /* Global theme transition styles */
        html.theme-transition,
        html.theme-transition *,
        html.theme-transition *:before,
        html.theme-transition *:after {
          transition: all 750ms cubic-bezier(0.23, 1, 0.32, 1) !important;
          transition-delay: 0 !important;
        }

        /* Animation for the theme transition overlay */
        @keyframes theme-transition-overlay {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }

        .theme-transition-overlay {
          position: fixed;
          top: var(--theme-change-y, 50%);
          left: var(--theme-change-x, 50%);
          width: 100vmax;
          height: 100vmax;
          border-radius: 50%;
          z-index: 9999;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
          background: radial-gradient(
            circle,
            var(--theme-change-color, rgba(255, 255, 255, 0.8)) 0%,
            transparent 70%
          );
          animation: theme-transition-overlay 1000ms forwards cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </>
  );
}