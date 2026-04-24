"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/components/site-navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative rounded-none border border-[#1A1B4B]/20 bg-[#FFFFFF] text-[#1A1B4B] hover:bg-[#1A1B4B]/10    "
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[min(23rem,100vw)] border-r border-[#1A1B4B]/20 bg-[#f7f5f1] p-0  "
      >
        <div className="border-b border-[#1A1B4B]/20 px-6 py-6 ">
          <div className="flex items-start justify-between gap-4">
            <Link href="/" onClick={() => setOpen(false)} className="space-y-1.5">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[#1A1B4B]/70 ">
                ACCM
              </p>
              <h2 className="text-base font-semibold uppercase tracking-[0.15em] text-[#1A1B4B] ">
                Career Mentorship
              </h2>
              <p className="text-sm leading-5 text-[#1A1B4B] ">
                Build practical direction from where you are.
              </p>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="rounded-none border border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10   "
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between border border-transparent px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.12em]",
                      openSubmenu === item.title
                        ? "border-[#1A1B4B]/20 bg-[#1A1B4B]/10 text-[#1A1B4B]   "
                        : "text-[#1A1B4B] hover:border-[#1A1B4B]/20 hover:bg-[#1A1B4B]/10   "
                    )}
                  >
                    {item.title}
                    <motion.div
                      animate={{ rotate: openSubmenu === item.title ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openSubmenu === item.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 mt-1 space-y-1 border-l border-[#1A1B4B]/20 pl-2 ">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center justify-between px-4 py-2.5 text-sm",
                                pathname === subItem.href
                                  ? "bg-[#1A1B4B]/10 text-[#1A1B4B]  "
                                  : "text-[#1A1B4B] hover:bg-[#1A1B4B]/10  "
                              )}
                            >
                              {subItem.title}
                              <ChevronRight className="h-4 w-4 opacity-60" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href || "/"}
                  className={cn(
                    "flex items-center justify-between border border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em]",
                    pathname === item.href
                      ? "border-[#1A1B4B]/20 bg-[#1A1B4B]/10 text-[#1A1B4B]   "
                      : "text-[#1A1B4B] hover:border-[#1A1B4B]/20 hover:bg-[#1A1B4B]/10   "
                  )}
                >
                  {item.title}
                  <ChevronRight className="h-4 w-4 opacity-60" />
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
