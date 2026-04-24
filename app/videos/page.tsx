"use client";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ArrowUpRight, Play, Sparkles, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoList } from "@/components/video-list";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const videos = [
  {
    id: "1",
    title: "Mapping Your Career Direction",
    description: "How to identify and pursue your ideal professional path with clarity and confidence.",
    thumbnailUrl: "/videos/career-direction.jpg",
    videoId: "dQw4w9WgXcQ",
    duration: "12:34",
    category: "Career Planning",
  },
  {
    id: "2",
    title: "The Art of Professional Networking",
    description: "Build meaningful connections that advance your career opportunities.",
    thumbnailUrl: "/videos/networking.jpg",
    videoId: "6_b7RDuLwcI",
    duration: "8:45",
    category: "Networking",
  },
  {
    id: "3",
    title: "CVs That Get Results",
    description: "Create resumes that recruiters notice and remember.",
    thumbnailUrl: "/videos/cv-writing.jpg",
    videoId: "Tt08KmFfIYQ",
    duration: "15:20",
    category: "Documentation",
  },
  {
    id: "4",
    title: "Scholarship Application Mastery",
    description: "Strategic approach to winning international scholarship funding.",
    thumbnailUrl: "/videos/scholarship.jpg",
    videoId: "abc123",
    duration: "22:10",
    category: "Scholarships",
  },
  {
    id: "5",
    title: "Interview Success Formula",
    description: "Proven techniques for confident interview performance.",
    thumbnailUrl: "/videos/interview.jpg",
    videoId: "def456",
    duration: "18:45",
    category: "Interviews",
  },
  {
    id: "6",
    title: "Building Your Professional Brand",
    description: "Establish your unique market position and visibility.",
    thumbnailUrl: "/videos/brand.jpg",
    videoId: "ghi789",
    duration: "11:30",
    category: "Personal Brand",
  },
];

function VideoCard({
  video,
  index,
  onPlay,
}: {
  video: (typeof videos)[0];
  index: number;
  onPlay: (videoId: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        "group cursor-pointer",
        index % 3 === 1 ? "md:translate-y-6" : "",
        index % 3 === 2 ? "md:-translate-y-3" : ""
      )}
      onClick={() => onPlay(video.videoId)}
    >
      <div className="border border-gray-300 bg-white/70 dark:border-gray-800 dark:bg-[#171b1d]">
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-[#ebe7df] dark:bg-[#121518]">
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-semibold text-gray-400 dark:text-gray-600">
                {video.category[0]}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center bg-white/90 dark:bg-gray-100">
              <Play className="ml-1 h-6 w-6 text-gray-900 dark:text-gray-900" fill="currentColor" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-gray-900/80 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-white">
            {video.duration}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            {video.category}
          </p>
          <h3 className="mt-2 text-base font-semibold uppercase leading-tight">
            {video.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300 line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default async function VideosPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
        <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
          <section className="border border-gray-300 dark:border-gray-800">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
                <p className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  <Lock className="h-3.5 w-3.5" />
                  Members only
                </p>
                <h1 className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]">
                  Premium video library.
                </h1>
                <p className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300">
                  Access our full collection of career development videos,
                  mentorship guidance, and expert masterclasses.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login?callbackUrl=/videos">
                    <Button className="h-11 rounded-none bg-gray-900 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                      Sign in
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="ghost"
                      className="h-11 rounded-none border border-gray-300 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Create account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[22rem] border-t border-gray-300 dark:border-gray-800 lg:border-l lg:border-t-0">
                <div className="absolute inset-0 bg-[#171b1d]">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="mx-auto h-10 w-10 text-gray-600 dark:text-gray-500" />
                      <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                        Member content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Not a member?
                </p>
                <h2 className="text-balance text-[clamp(1.55rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                  Unlock your career potential.
                </h2>
                <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                  Get unlimited access to all premium videos, live workshops,
                  and one-on-one mentorship sessions.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { count: "50+", label: "Video masterclasses" },
                  { count: "100+", label: "Hours of content" },
                  { count: "24/7", label: "Access anywhere" },
                  { count: "Expert", label: "Facilitators" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border border-gray-300 bg-white/70 p-4 dark:border-gray-800 dark:bg-[#171b1d]"
                  >
                    <p className="text-2xl font-semibold">{item.count}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-gray-300 dark:border-gray-800">
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Ready to start
                </p>
                <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                  Begin your journey today.
                </h2>
                <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                  Join thousands of professionals accelerating their careers
                  with ACCM mentorship and resources.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-3 bg-[#ece8df] px-6 py-10 dark:bg-[#0f1315] sm:px-10">
                <Link href="/register">
                  <Button className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                    Create account
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="ghost"
                    className="h-11 w-full rounded-none border border-gray-300 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    View services
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <p className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                <Sparkles className="h-3.5 w-3.5" />
                Video library
              </p>
              <h1 className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]">
                Learn at your own pace.
              </h1>
              <p className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300">
                Curated video content designed for African professionals. Build skills,
                gain clarity, and accelerate your career journey.
              </p>
            </div>
            <div className="relative min-h-[22rem] border-t border-gray-300 dark:border-gray-800 lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-[#ebe7df] dark:bg-[#121518]">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Play className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      50+ Videos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div className="grid gap-1">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                Featured content
              </p>
              <h2 className="text-balance text-[clamp(1.5rem,3vw,2.6rem)] font-semibold uppercase leading-tight">
                Latest releases
              </h2>
            </div>
            <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              {videos.length} videos available
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onPlay={(videoId) => console.log("Play:", videoId)}
              />
            ))}
          </div>
        </section>

        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Keep learning
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Continue your growth journey.
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                Explore more resources and services to accelerate your professional
                development.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 bg-[#ece8df] px-6 py-10 dark:bg-[#0f1315] sm:px-10">
              <Link href="/services">
                <Button className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                  Browse services
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  variant="ghost"
                  className="h-11 w-full rounded-none border border-gray-300 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  View events
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}