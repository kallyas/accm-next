"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function SessionRequiredBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="container py-3"
      >
        <Alert className="bg-[#1A1B4B]/10 text-[#1A1B4B] border-[#1A1B4B]/20    flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
            <div>
              <AlertTitle className="text-[#1A1B4B] ">
                Sign in for full access
              </AlertTitle>
              <AlertDescription className="text-[#1A1B4B]  text-sm">
                Create an account or sign in to save your preferences and
                booking history.
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-[#1A1B4B]/20 hover:bg-[#1A1B4B]/10  "
              onClick={() => setDismissed(true)}
            >
              Continue as guest
            </Button>
            <Link href="/login?callbackUrl=/book-session">
              <Button
                size="sm"
                className="bg-[#1A1B4B]/10 hover:bg-[#1A1B4B]/10 text-[#FFFFFF]  "
              >
                Sign In
              </Button>
            </Link>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
