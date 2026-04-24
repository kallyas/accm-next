// app/error.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Home,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Shield,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const messages = [
      "Our systems are taking a short pause.",
      "We hit a technical interruption in this flow.",
      "Our digital mentors need a moment to regroup.",
      "We are facing a small roadblock on your path to success.",
      "Our career guidance algorithms are in a brief meeting.",
      "Our systems need a quick recovery moment.",
    ];

    setErrorMessage(messages[Math.floor(Math.random() * messages.length)]);

    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFFFF] px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-24 top-[-4rem] h-72 w-72 rounded-full bg-[#1A1B4B]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-[-5rem] h-80 w-80 rounded-full bg-[#26A649]/15 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-12 lg:gap-10">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-[#1A1B4B]/20 bg-[#1A1B4B] p-6 text-[#FFFFFF] lg:col-span-4 lg:mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#26A649]">
            Recovery Mode
          </p>
          <div className="mt-5 text-[clamp(2.6rem,8vw,5.2rem)] font-semibold leading-none">
            500
          </div>
          <p className="mt-4 max-w-xs text-sm text-[#FFFFFF]/85">
            An internal error interrupted this request.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 border border-[#FFFFFF]/30 px-3 py-2 text-xs uppercase tracking-[0.16em]">
            <Shield className="h-4 w-4 text-[#26A649]" />
            Protected Flow
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="border border-[#1A1B4B]/20 bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[clamp(1.8rem,5vw,3.2rem)] font-semibold uppercase leading-tight text-[#1A1B4B]">
                Server Error
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#1A1B4B]/70">
                {errorMessage}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center border border-[#1A1B4B]/20 bg-[#1A1B4B]/5">
              <AlertCircle className="h-6 w-6 text-[#1A1B4B]" />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Button
              onClick={() => reset()}
              className="h-11 bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="h-11 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button asChild variant="outline" className="h-11 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-[#26A649]/30 bg-[#26A649]/10 p-4">
              <h3 className="flex items-center text-sm font-semibold uppercase tracking-[0.16em] text-[#26A649]">
                <MessageSquare className="mr-2 h-4 w-4" />
                Need assistance?
              </h3>
              <p className="mt-2 text-sm text-[#1A1B4B]/75">
                Contact support and share what you clicked before the error appeared.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10">
                <Link href="/contact">
                  <SendHorizontal className="mr-2 h-3.5 w-3.5" />
                  Contact Support
                </Link>
              </Button>
            </div>

            <div className="border border-[#1A1B4B]/20 bg-[#1A1B4B]/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1B4B]/70">
                Error digest
              </p>
              <p className="mt-2 break-all text-sm text-[#1A1B4B]">
                {error.digest || "No digest available"}
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#1A1B4B]/20 bg-[#FFFFFF] p-4 text-xs">
          <details className="text-[#1A1B4B]/75">
            <summary className="cursor-pointer font-medium">Developer error details</summary>
            <pre className="mt-2 overflow-x-auto border border-[#1A1B4B]/20 bg-[#1A1B4B]/5 p-2">
              {error.message}
              {error.stack && (
                <div className="mt-2 text-[#1A1B4B]/60">
                  {error.stack}
                </div>
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
