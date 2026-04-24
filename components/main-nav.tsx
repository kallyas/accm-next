"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { navigationItems } from "@/components/site-navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("hidden md:flex items-center", className)}
      aria-label="Primary navigation"
      {...props}
    >
      <ul className="flex items-center gap-x-[clamp(0.45rem,1vw,1.15rem)]">
        {navigationItems.map((item) => {
            if (!item.submenu) {
              const active = pathname === item.href;
              return (
                <li key={item.title}>
                  <Link
                    href={item.href || "/"}
                    className={cn(
                      "group relative inline-flex items-center px-2 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
                      active
                        ? "text-[#1A1B4B] "
                        : "text-[#1A1B4B]/70 hover:text-[#1A1B4B]  "
                    )}
                  >
                    {item.title}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px bg-current transition-all duration-300",
                        active ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                </li>
              );
            }

            const hasActiveChild = item.submenu.some(
              (subitem) => pathname === subitem.href
            );

            return (
              <li key={item.title} className="group relative">
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
                    hasActiveChild
                      ? "text-[#1A1B4B] "
                      : "text-[#1A1B4B]/70 group-hover:text-[#1A1B4B]  "
                  )}
                >
                  {item.title}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                <div className="pointer-events-none absolute left-0 top-full z-50 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <ul className="grid w-[min(34rem,68vw)] grid-cols-2 gap-2 border border-[#1A1B4B]/20 bg-[#FFFFFF] px-3 py-3 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.55)]  ">
                    {item.submenu.map((subitem) => (
                      <li key={subitem.href}>
                        <Link
                          href={subitem.href}
                          className={cn(
                            "group/item block border border-transparent px-3 py-3 transition-colors",
                            pathname === subitem.href
                              ? "border-[#1A1B4B]/20 bg-[#1A1B4B]/10  "
                              : "hover:border-[#1A1B4B]/20 hover:bg-[#1A1B4B]/5  "
                          )}
                        >
                          <div className="flex items-center justify-between text-sm font-semibold text-[#1A1B4B] ">
                            <span>{subitem.title}</span>
                            <ChevronRight className="h-4 w-4 text-[#1A1B4B]/70 opacity-0 transition-opacity group-hover/item:opacity-100" />
                          </div>
                          {subitem.description ? (
                            <p className="mt-1 text-xs leading-5 text-[#1A1B4B]/70 ">
                              {subitem.description}
                            </p>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
        })}
      </ul>
    </nav>
  );
}
