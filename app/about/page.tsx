"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Book,
  BookOpen,
  Building,
  CheckCircle,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Star,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const coreValues = [
  {
    icon: Award,
    title: "Professionalism",
    description:
      "We maintain the highest standards of professional conduct in all interactions.",
  },
  {
    icon: Book,
    title: "Research",
    description:
      "We ground our guidance in evidence-based practices and continuous learning.",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "We pursue quality in every mentoring pathway, programme, and learner touchpoint.",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description:
      "We co-create outcomes with institutions, mentors, and professionals across Africa.",
  },
];

const objectives = [
  {
    icon: Building,
    title: "Build a Sustainable and Self-Financing Organisation",
    description:
      "Grow to 500 full-time staff and achieve 80% funding from earned revenue.",
  },
  {
    icon: BookOpen,
    title: "Develop Comprehensive Career Mentorship Curricula",
    description: "Create 50+ curricula across all disciplines and levels.",
  },
  {
    icon: Building,
    title: "Establish a Continental Mentorship Network",
    description:
      "Build 5 primary hubs and 15 secondary hubs with presence in all 54 African countries.",
  },
  {
    icon: Target,
    title: "Expand Access to Career Guidance Services",
    description:
      "Reach 100 million active users annually through digital and physical platforms.",
  },
  {
    icon: Users,
    title: "Institutionalise Career Guidance Systems",
    description:
      "Integrate structured career guidance into universities and schools across Africa.",
  },
  {
    icon: Users,
    title: "Deliver Human Capital Development Programmes",
    description:
      "Train 100,000 professionals annually through applied programmes and mentorship.",
  },
  {
    icon: Lightbulb,
    title: "Deploy Advanced Technology",
    description:
      "Deploy AI Mentor and Quantum Career Simulator for personalised guidance.",
  },
  {
    icon: Award,
    title: "Implement High School Research Programme",
    description:
      "Support 25,000 students annually and 500,000 cumulative scholarships.",
  },
  {
    icon: Book,
    title: "Build a Pan-African Content Ecosystem",
    description:
      "Scale apps, books, podcasts, and certification systems for mass access.",
  },
];

const theoryOfChange = [
  {
    title: "Problem",
    points: [
      "Limited access to structured career guidance in Africa",
      "Mismatch between education and labor market needs",
      "High youth unemployment and underemployment",
    ],
  },
  {
    title: "Inputs",
    points: [
      "Digital platforms, apps, AI tools, and online communities",
      "Skilled mentors and partnerships with universities, employers, and governments",
      "Funding, institutional support, research, and curriculum development",
    ],
  },
  {
    title: "Activities",
    points: [
      "Deliver virtual and physical mentorship",
      "Develop and distribute career curricula",
      "Deploy AI and quantum-based tools",
      "Run the High School Research Programme",
      "Establish regional hubs and provide training sessions",
    ],
  },
  {
    title: "Outputs",
    points: [
      "Millions of users accessing mentorship platforms",
      "Career curricula and digital tools developed",
      "Students matched with mentors and researchers",
      "Career certifications issued and regional hubs operational",
    ],
  },
  {
    title: "Outcomes",
    points: [
      "Increased employability and career readiness",
      "More scholarship placements and career transitions",
      "Stronger institutional career guidance systems",
      "Increased professional skills across the workforce",
    ],
  },
  {
    title: "Impact",
    points: [
      "Reduced youth unemployment",
      "Improved human capital development",
      "Increased socioeconomic mobility",
      "A transformed African workforce aligned with global opportunities",
    ],
  },
];

const previousWork = [
  "Conducted a Leadership and Change Management training at Give Directly, Uganda, December 2023",
  "Excellence at work, Career Visualization and Conflicts resolution at African Youth Action Network, July, 2023 and January 2024",
  "International Coaching for professionals with success rate of 98.1% admission stage and scholarship at 82.7% for 2023-24",
  "Youth empowered leadership and entrepreneurship inaugural project, July-September 2023",
];

const communityService = [
  "Contributed to education services access through Nalusaga Young Persons Savings and Cooperative Society LTD, Himutu Subcounty, Butaleja District (REG NO P9392/RCS) (USD 4,174)",
  "Supported girl child school retention project at Butaleja Technical Institute, 2023 (USD 55.5)",
];

export default function AboutPage() {
  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[22rem]">
              <Image
                src="/accm/IMG_4727.JPG"
                alt="African Centre For Career Mentorship Team"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400"
              >
                About ACCM
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.1vw,3.7rem)] font-semibold uppercase leading-[0.98]"
              >
                Career mentorship as infrastructure for Africa.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                We are building a sustainable centre of excellence for career
                mentorship and human capital development at scale.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Our story
              </p>
              <h2 className="text-balance text-[clamp(1.55rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                We equip youth and professionals with market-relevant direction.
              </h2>
            </div>
            <div className="space-y-5 text-sm leading-8 text-gray-700 dark:text-gray-300">
              <p>
                African Centre For Career Mentorship is building a scalable,
                technology-driven ecosystem that transforms career guidance
                access across Africa.
              </p>
              <p>
                We support professionals to discover and activate their full
                potential through mentorship, structured learning, and practical
                labour-market alignment.
              </p>
              <p>
                By 2050, our ambition is to drive socioeconomic transformation by
                reaching millions through strategic partnerships and advanced
                career technologies.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  className="h-10 rounded-none bg-gray-900 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  <Link href="/contact">Connect with us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Vision",
                body: "A sustainable centre of excellence for Career Mentorship and Human Capital Development in Africa.",
              },
              {
                title: "Mission",
                body: "Equip youths and professionals with growing and changing job market skills while supporting socioeconomic transformation.",
              },
              {
                title: "Goal",
                body: "Build a scalable, technology-driven mentorship ecosystem reaching millions by 2050.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]"
              >
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-8 text-gray-700 dark:text-gray-300">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="mb-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Core values
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Principles that shape how we mentor and build.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <article
                key={value.title}
                className={`border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d] ${
                  index === 1 ? "lg:translate-y-6" : ""
                }`}
              >
                <value.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h3 className="mt-4 text-base font-semibold uppercase tracking-[0.03em]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="mb-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Strategic objectives by 2050
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              The roadmap for long-term continental impact.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {objectives.map((objective) => (
              <article
                key={objective.title}
                className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]"
              >
                <objective.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.06em]">
                  {objective.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {objective.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="mb-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Theory of change
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              How our actions translate into measurable outcomes.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {theoryOfChange.map((block, index) => (
              <article
                key={block.title}
                className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]"
              >
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-base font-semibold uppercase tracking-[0.03em]">
                  {block.title}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {block.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
                      <span className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="mb-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Impact
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Evidence of delivery across programmes and communities.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-base font-semibold uppercase tracking-[0.03em]">
                  Previous work
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {previousWork.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
                    <span className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-base font-semibold uppercase tracking-[0.03em]">
                  Community service
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {communityService.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
                    <span className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="border border-t-0 border-gray-300 dark:border-gray-800">
          <div className="grid md:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Next step
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Build your growth plan with our team.
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                Whether you are beginning, pivoting, or scaling your career, we
                can help you map a clear path and execute with confidence.
              </p>
            </div>
            <div className="flex items-center justify-center bg-[#ece8df] p-6 dark:bg-[#0f1315] sm:p-10">
              <div className="w-full max-w-sm space-y-3">
                <Button
                  asChild
                  className="h-10 w-full rounded-none bg-gray-900 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  <Link href="/contact">Contact us</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="h-10 w-full rounded-none border border-gray-300 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Link href="/services">Explore services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
