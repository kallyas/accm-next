// app/not-found.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Home,
  ArrowLeft,
  Search,
  Compass,
  BookOpen,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Custom404Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [randomMessage, setRandomMessage] = React.useState("");

  React.useEffect(() => {
    const messages = [
      "Oops! This page seems to have gone on a career break.",
      "Looks like this page is still exploring its career options.",
      "This page has graduated from our site.",
      "Sorry, this path to success doesn't exist.",
      "This knowledge resource has moved on to better opportunities.",
      "This page is taking a gap year. Try another destination.",
    ];

    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFFFF] px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-24 top-[-4rem] h-72 w-72 rounded-full bg-[#1A1B4B]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-[-4rem] h-80 w-80 rounded-full bg-[#26A649]/15 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-12 lg:gap-10">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-[#1A1B4B]/20 bg-[#1A1B4B] p-6 text-[#FFFFFF] lg:col-span-4 lg:mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#26A649]">
            Navigation
          </p>
          <div className="mt-5 text-[clamp(2.8rem,8vw,5.4rem)] font-semibold leading-none">
            404
          </div>
          <p className="mt-4 max-w-xs text-sm text-[#FFFFFF]/85">
            The page you requested does not exist or has moved.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 border border-[#FFFFFF]/30 px-3 py-2 text-xs uppercase tracking-[0.16em]">
            <Compass className="h-4 w-4 text-[#26A649]" />
            Find Route
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
                Page Not Found
              </h1>
              <p className="mt-2 text-sm text-[#1A1B4B]/70">{randomMessage}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center border border-[#1A1B4B]/20 bg-[#1A1B4B]/5">
              <AlertTriangle className="h-6 w-6 text-[#1A1B4B]" />
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              type="text"
              placeholder="Search for pages or resources"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 border-[#1A1B4B]/20 bg-[#FFFFFF] text-[#1A1B4B] placeholder:text-[#1A1B4B]/45"
            />
            <Button type="submit" className="h-11 bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/" className="border border-[#1A1B4B]/20 bg-[#1A1B4B]/5 p-4 transition-colors hover:bg-[#1A1B4B]/10">
              <Home className="h-5 w-5 text-[#1A1B4B]" />
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-[#1A1B4B]">Home</p>
              <p className="mt-1 text-xs text-[#1A1B4B]/65">Return to the main page.</p>
            </Link>

            <Link href="/career-map" className="border border-[#1A1B4B]/20 bg-[#26A649]/10 p-4 transition-colors hover:bg-[#26A649]/15">
              <Briefcase className="h-5 w-5 text-[#26A649]" />
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-[#1A1B4B]">Career Map</p>
              <p className="mt-1 text-xs text-[#1A1B4B]/65">Continue your assessment flow.</p>
            </Link>

            <Link href="/scholarship-quest" className="border border-[#1A1B4B]/20 bg-[#1A1B4B]/5 p-4 transition-colors hover:bg-[#1A1B4B]/10">
              <GraduationCap className="h-5 w-5 text-[#1A1B4B]" />
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-[#1A1B4B]">Scholarships</p>
              <p className="mt-1 text-xs text-[#1A1B4B]/65">Explore available opportunities.</p>
            </Link>

            <Link href="/resources" className="border border-[#1A1B4B]/20 bg-[#26A649]/10 p-4 transition-colors hover:bg-[#26A649]/15">
              <BookOpen className="h-5 w-5 text-[#26A649]" />
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-[#1A1B4B]">Resources</p>
              <p className="mt-1 text-xs text-[#1A1B4B]/65">Read guides and learning materials.</p>
            </Link>
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="h-11 border-[#1A1B4B]/20 text-[#1A1B4B] hover:bg-[#1A1B4B]/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
