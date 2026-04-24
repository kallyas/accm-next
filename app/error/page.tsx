"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    const destination = params.get("returnTo");
    setErrorMessage(message ? decodeURIComponent(message) : "");
    setReturnTo(destination ? decodeURIComponent(destination) : null);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFFFF] px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-[-5rem] h-72 w-72 rounded-full bg-[#1A1B4B]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-[-4rem] h-80 w-80 rounded-full bg-[#26A649]/15 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-12 lg:gap-10">
        <aside className="border border-[#1A1B4B]/20 bg-[#1A1B4B] p-6 text-[#FFFFFF] lg:col-span-4 lg:mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#26A649]">
            System Notice
          </p>
          <div className="mt-5 text-[clamp(2.8rem,8vw,5.5rem)] font-semibold leading-none">
            Error
          </div>
          <p className="mt-4 max-w-xs text-sm text-[#FFFFFF]/85">
            We hit an interruption while processing this request.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 border border-[#FFFFFF]/30 px-3 py-2 text-xs uppercase tracking-[0.16em]">
            <AlertTriangle className="h-4 w-4 text-[#26A649]" />
            Recovery Flow
          </div>
        </aside>

        <section className="border border-[#1A1B4B]/20 bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-8">
          <h1 className="text-[clamp(1.8rem,5vw,3.2rem)] font-semibold uppercase leading-tight text-[#1A1B4B]">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#1A1B4B]/70">
            {errorMessage || "This request could not complete. Try again or return to a stable page."}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              onClick={() => router.refresh()}
              className="h-11 bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh page
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="h-11 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {returnTo ? (
              <Button asChild variant="outline" className="h-11 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10">
                <Link href={returnTo}>Return to previous path</Link>
              </Button>
            ) : (
              <div />
            )}
            <Button asChild variant="outline" className="h-11 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>

          <div className="mt-8 border border-[#26A649]/30 bg-[#26A649]/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#26A649]">
              Need help now?
            </p>
            <p className="mt-1 text-sm text-[#1A1B4B]/75">
              If this keeps happening, contact support and include what you were trying to do.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
