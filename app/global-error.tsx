"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertOctagon, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFFFF]">
        <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-8 lg:px-12">
          <div className="pointer-events-none absolute -left-24 top-[-4rem] h-72 w-72 rounded-full bg-[#1A1B4B]/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-[-5rem] h-80 w-80 rounded-full bg-[#26A649]/15 blur-3xl" />

          <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-12 lg:gap-10">
            <aside className="border border-[#1A1B4B]/20 bg-[#1A1B4B] p-6 text-[#FFFFFF] lg:col-span-4 lg:mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#26A649]">
                Global Error
              </p>
              <div className="mt-5 text-[clamp(2.8rem,8vw,5.5rem)] font-semibold leading-none">
                Halt
              </div>
              <p className="mt-4 max-w-xs text-sm text-[#FFFFFF]/85">
                A top-level failure stopped rendering for this request.
              </p>
            </aside>

            <section className="border border-[#1A1B4B]/20 bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-8">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-[clamp(1.8rem,5vw,3.2rem)] font-semibold uppercase leading-tight text-[#1A1B4B]">
                  Unexpected global failure
                </h1>
                <div className="flex h-12 w-12 items-center justify-center border border-[#1A1B4B]/20 bg-[#1A1B4B]/5">
                  <AlertOctagon className="h-6 w-6 text-[#1A1B4B]" />
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-sm text-[#1A1B4B]/70">
                Please retry this action. If the issue persists, return home and try a different route.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button onClick={reset} className="h-11 bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
                <Button asChild variant="outline" className="h-11 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </div>

              <div className="mt-8 border border-[#1A1B4B]/20 bg-[#1A1B4B]/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1B4B]/70">
                  Error digest
                </p>
                <p className="mt-2 break-all text-sm text-[#1A1B4B]">
                  {error.digest || "No digest available"}
                </p>
              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
