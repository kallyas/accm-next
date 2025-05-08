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
        <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
            <div>
              <AlertTitle className="text-blue-800 dark:text-blue-300">
                Sign in for full access
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
                Create an account or sign in to save your preferences and
                booking history.
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-800/50"
              onClick={() => setDismissed(true)}
            >
              Continue as guest
            </Button>
            <Link href="/login?callbackUrl=/book-session">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
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
