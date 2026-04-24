import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Compass, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedMentors } from "@/components/featured-mentors";
import { TestimonialSlider } from "@/components/testimonial-slider";

const tracks = [
  {
    title: "Career Mapping",
    subtitle: "Where to play and how to grow",
    description:
      "Get practical direction using your strengths, goals, and market realities.",
    href: "/career-map",
    stat: "10,000+ professionals served",
  },
  {
    title: "CV Alignment",
    subtitle: "Position your value clearly",
    description:
      "Translate your impact into evidence-based CV narratives recruiters trust.",
    href: "/cv-alignment",
    stat: "High-conversion profile upgrades",
  },
  {
    title: "Scholarship Quest",
    subtitle: "Find aligned opportunities",
    description:
      "Discover scholarship pathways that fit your profile and ambitions.",
    href: "/scholarship-quest",
    stat: "13+ destination countries",
  },
];

const pathways = [
  {
    title: "Mentorship",
    text: "Structured one-to-one guidance with seasoned professionals.",
    href: "/mentors",
    image: "/accm/IMG_4681.JPG",
  },
  {
    title: "Workshops",
    text: "Hands-on sessions focused on real employability outcomes.",
    href: "/services",
    image: "/accm/IMG_4713.JPG",
  },
  {
    title: "Offers",
    text: "Time-sensitive pathways for scholarship and career acceleration.",
    href: "/offers",
    image: "/offers/WhatsApp Image 2025-09-24 at 08.04.07.jpeg",
  },
];

export default function Home() {
  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main>
        <section className="border-b border-gray-300 dark:border-gray-800">
          <div className="mx-auto grid w-full max-w-[88rem] gap-10 px-5 pb-14 pt-14 sm:px-7 md:pb-20 md:pt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)] lg:gap-14 lg:px-10">
            <div className="space-y-8">
              <p className="inline-flex items-center gap-2 border border-gray-300 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <Sparkles className="h-3.5 w-3.5" />
                Career mentorship in motion
              </p>

              <div className="space-y-5">
                <h1 className="max-w-[17ch] text-balance text-[clamp(2.2rem,5.6vw,5.6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
                  Direction for your next professional leap.
                </h1>
                <p className="max-w-[56ch] text-base leading-8 text-gray-700 dark:text-gray-300">
                  We help students and professionals across Africa move from
                  uncertainty to a clear growth path through mentorship, skill
                  development, and scholarship strategy.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button className="h-11 rounded-none bg-gray-900 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                    Start your journey
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    className="h-11 rounded-none border border-gray-300 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    How it works
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-5 self-end sm:grid-cols-2">
              <div className="relative overflow-hidden border border-gray-300 bg-[#ebe7df] p-3 dark:border-gray-800 dark:bg-[#171b1d] sm:mt-14">
                <div className="relative h-[21.5rem]">
                  <Image
                    src="/accm/IMG_4666.JPG"
                    alt="Mentorship session"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="space-y-5">
                <div className="relative overflow-hidden border border-gray-300 bg-[#ebe7df] p-3 dark:border-gray-800 dark:bg-[#171b1d]">
                  <div className="relative h-[14.2rem]">
                    <Image
                      src="/accm/IMG_4710.JPG"
                      alt="Community event"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    Impact snapshot
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xl font-semibold">10K+</p>
                      <p className="text-[0.66rem] uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                        Learners
                      </p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">85%</p>
                      <p className="text-[0.66rem] uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                        Progress
                      </p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">500+</p>
                      <p className="text-[0.66rem] uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                        Scholarships
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mx-auto grid w-full max-w-[88rem] gap-10 px-5 sm:px-7 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:px-10">
            <div className="space-y-4">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                Core tracks
              </p>
              <h2 className="max-w-[14ch] text-balance text-[clamp(1.8rem,3.6vw,3.5rem)] font-semibold uppercase leading-[1]">
                Build momentum with structured pathways.
              </h2>
              <p className="max-w-[42ch] text-sm leading-7 text-gray-700 dark:text-gray-300">
                Start with the immediate bottleneck in your journey, then layer
                mentorship and resources to sustain progress.
              </p>
            </div>

            <div className="space-y-4">
              {tracks.map((track, index) => (
                <Link
                  key={track.title}
                  href={track.href}
                  className="group grid gap-3 border border-gray-300 bg-white/75 p-5 transition-colors hover:bg-[#ece8df] dark:border-gray-800 dark:bg-[#171b1d] dark:hover:bg-[#1b2022] md:grid-cols-[auto_1fr_auto] md:items-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-[0.67rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                      {track.subtitle}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">{track.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {track.description}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                      {track.stat}
                    </p>
                    <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-gray-700 dark:text-gray-300">
                      Explore
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-7 lg:px-10">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                  Signature pathways
                </p>
                <h2 className="mt-2 text-balance text-[clamp(1.7rem,3.2vw,3rem)] font-semibold uppercase leading-tight">
                  Choose the format that fits your pace.
                </h2>
              </div>
              <Link href="/services" className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-700 underline decoration-gray-400 underline-offset-4 dark:text-gray-200 dark:decoration-gray-600">
                View all services
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {pathways.map((path, index) => (
                <Link
                  key={path.title}
                  href={path.href}
                  className={`group relative overflow-hidden border border-gray-300 dark:border-gray-800 ${
                    index === 1 ? "md:translate-y-8" : ""
                  } ${index === 2 ? "md:-translate-y-4" : ""}`}
                >
                  <div className="relative h-[18.5rem]">
                    <Image
                      src={path.image}
                      alt={path.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="text-2xl font-semibold">{path.title}</h3>
                    <p className="mt-1 text-sm text-white/90">{path.text}</p>
                    <span className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-white/95">
                      Learn more
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mx-auto grid w-full max-w-[88rem] gap-10 px-5 sm:px-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:px-10">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4" />
                Mentors
              </p>
              <h2 className="text-balance text-[clamp(1.7rem,3vw,2.8rem)] font-semibold uppercase leading-tight">
                Learn directly from proven practitioners.
              </h2>
              <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                Mentorship is practical, contextual, and built for the realities
                of the African job market.
              </p>
            </div>
            <FeaturedMentors />
          </div>
        </section>

        <section className="border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mx-auto grid w-full max-w-[88rem] gap-10 px-5 sm:px-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:px-10">
            <div className="order-2 lg:order-1">
              <TestimonialSlider />
            </div>
            <div className="order-1 space-y-4 lg:order-2">
              <p className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                <Compass className="h-4 w-4" />
                Outcomes
              </p>
              <h2 className="text-balance text-[clamp(1.7rem,3vw,2.8rem)] font-semibold uppercase leading-tight">
                Real progress from real people.
              </h2>
              <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                Career transitions, better positioning, and scholarship wins are
                the result of consistent strategy plus accountability.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-7 lg:px-10">
            <div className="grid gap-0 border border-gray-300 dark:border-gray-800 md:grid-cols-[1.12fr_0.88fr]">
              <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Start now
                </p>
                <h2 className="mt-3 max-w-[16ch] text-balance text-[clamp(1.8rem,3.6vw,3.1rem)] font-semibold uppercase leading-tight">
                  Make your next move intentional.
                </h2>
                <p className="mt-4 max-w-[46ch] text-sm leading-7 text-gray-300">
                  Join ACCM and build a practical career plan with mentors,
                  workshops, and scholarship support designed around your goals.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3 bg-[#ece8df] px-6 py-10 dark:bg-[#0f1315] sm:px-10">
                <Link href="/register">
                  <Button className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                    Create account
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="ghost"
                    className="h-11 w-full rounded-none border border-gray-300 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Talk to our team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
