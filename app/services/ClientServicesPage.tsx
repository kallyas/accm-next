"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Search,
  MessageSquare,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Award,
  ChevronRight,
  Mail,
  Phone,
  Zap,
  Calendar,
  Check,
} from "lucide-react";
import Link from "next/link";
import { SubscribePlan } from "@/components/user/subscribe-plan";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import ServiceCard from "@/components/services/ServiceCard";
import { cn } from "@/lib/utils";

const serviceCategories = [
  {
    id: "career",
    name: "Career Development",
    description: "Personalized programs to advance your professional journey",
    icon: Briefcase,
    services: [
      {
        icon: Search,
        title: "Career Discovery & Planning",
        description: "Structured guidance to identify and pursue your ideal career path",
        features: [
          "Comprehensive career assessment and profiling",
          "Personalized career roadmap development",
          "Industry-specific guidance and insights",
          "Long-term career progression planning",
        ],
        color: "blue",
        image: "/services/career-planning.jpg",
      },
      {
        icon: Users,
        title: "Human Capital Development",
        description: "Comprehensive programs to build essential professional skills",
        features: [
          "Leadership and management skills training",
          "Change management and adaptability development",
          "Professional excellence and workplace competencies",
          "Team building and collaborative skills enhancement",
        ],
        color: "purple",
        image: "/services/leadership.jpg",
      },
      {
        icon: MessageSquare,
        title: "Interview Success Program",
        description: "Comprehensive preparation for confident, successful interviews",
        features: [
          "Personalized mock interview sessions with feedback",
          "Industry-specific question preparation",
          "Body language and presentation coaching",
          "Salary negotiation techniques",
        ],
        color: "green",
        image: "/services/interview.jpg",
      },
    ],
  },
  {
    id: "scholarship",
    name: "Scholarship & Academic",
    description: "Expert guidance for educational advancement opportunities",
    icon: GraduationCap,
    services: [
      {
        icon: GraduationCap,
        title: "International Scholarships Coaching",
        badge: "Most Popular",
        description: "Comprehensive guidance for winning international scholarships",
        features: [
          "Scholarship matching and opportunity identification",
          "Application strategy and timeline planning",
          "Personal statement and essay development",
          "Interview preparation and mock sessions",
        ],
        color: "amber",
        image: "/services/scholarship.jpg",
        packages: [
          {
            name: "Gold Package",
            duration: "6 months",
            features: [
              "Personal 1-on-1 mentoring",
              "Unlimited essay reviews",
              "Custom application strategy",
              "Interview preparation",
              "Weekly progress tracking",
            ],
          },
          {
            name: "Silver Package",
            duration: "3 months",
            features: [
              "Group mentoring sessions",
              "3 essay reviews",
              "General application guidance",
              "Basic interview tips",
              "Monthly progress check-ins",
            ],
          },
        ],
      },
      {
        icon: BookOpen,
        title: "Research & Academic Writing",
        description: "Develop essential research and scholarly writing skills",
        features: [
          "Research methodology and design training",
          "Academic writing and publishing guidance",
          "Literature review and analysis techniques",
          "Thesis and dissertation development support",
        ],
        color: "indigo",
        image: "/services/academic.jpg",
      },
    ],
  },
  {
    id: "documents",
    name: "Professional Documentation",
    description: "Expert assistance creating compelling professional documents",
    icon: FileText,
    services: [
      {
        icon: FileText,
        title: "Professional Document Preparation",
        description: "Create standout documents that showcase your professional value",
        features: [
          "Strategic CV/resume development and optimization",
          "Compelling personal statement creation",
          "Tailored cover letter development",
          "Professional portfolio organization",
        ],
        color: "cyan",
        image: "/services/documents.jpg",
      },
    ],
  },
];

const stats = [
  { value: "10,000+", label: "Professionals mentored" },
  { value: "98%", label: "Success rate" },
  { value: "500+", label: "Scholarships secured" },
  { value: "75+", label: "Partner organizations" },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof serviceCategories)[0]["services"][0];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]",
        index === 1 ? "md:translate-y-8" : "",
        index === 2 ? "md:-translate-y-4" : ""
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center border border-gray-300 bg-[#ece8df] dark:border-gray-700 dark:bg-[#121518]">
        <feature.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </div>
      <h3 className="mt-4 text-base font-semibold uppercase tracking-[0.03em]">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
        {feature.description}
      </p>
      <ul className="mt-4 space-y-2.5">
        {feature.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
            <span className="text-sm leading-7 text-gray-700 dark:text-gray-300">
              {f}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="#"
        className="mt-5 inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-gray-700 underline decoration-gray-400 underline-offset-4 dark:text-gray-200 dark:decoration-gray-600"
      >
        Learn more
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </motion.article>
  );
}

export default function ClientServicesPage({ session }) {
  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[22rem]">
              <Image
                src="/accm/IMG_4681.JPG"
                alt="Career mentorship services"
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
                Our services
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.1vw,3.7rem)] font-semibold uppercase leading-[0.98]"
              >
                Transform your career trajectory.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                Comprehensive programs designed to build skills, clarity,
                and confidence for your professional journey.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-7 flex flex-wrap gap-3"
              >
                {!session && (
                  <Link href="/register">
                    <Button className="h-11 rounded-none bg-gray-900 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                      Get started
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="#services">
                  <Button
                    variant="ghost"
                    className="h-11 rounded-none border border-gray-300 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Browse services
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Impact by numbers
              </p>
              <h2 className="text-balance text-[clamp(1.55rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Proven results across Africa.
              </h2>
              <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                Thousands of professionals have transformed their careers
                through our structured mentorship programs.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className={cn(
                    "border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]",
                    index === 1 ? "sm:translate-y-6" : "",
                    index === 3 ? "sm:-translate-y-3" : ""
                  )}
                >
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="services"
          className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20"
        >
          <div className="mb-12">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              What we offer
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Programs built for your growth.
            </h2>
          </div>

          <Tabs defaultValue="career" className="w-full">
            <TabsList className="mb-10 h-auto flex-wrap justify-start gap-2 bg-transparent p-0 dark:bg-transparent">
              {serviceCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-gray-50 dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 rounded-none border border-gray-300 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] data-[state=active]:border-gray-900 dark:data-[state=active]:border-gray-100 dark:data-[state=active]:border-gray-100"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {serviceCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-8">
                <p className="max-w-[42ch] text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {category.description}
                </p>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service, index) => (
                    <ServiceCard
                      key={service.title}
                      service={service}
                      color={service.color}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mb-12">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Membership
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Choose your access level.
            </h2>
          </div>

          <SubscribePlan />

          {!session && (
            <div className="mt-10 text-center">
              <Link href="/login">
                <Button className="h-11 rounded-none bg-gray-900 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                  Sign in to continue
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </section>

        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Need guidance
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Not sure where to start?
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                Our team can help you identify the right program for your
                specific career goals.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:admin@africanccm.com"
                  className="border border-gray-700 bg-white/5 px-4 py-3 text-sm leading-6 text-gray-300 transition-colors hover:bg-white/10"
                >
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Email
                  </span>
                  admin@africanccm.com
                </a>
                <a
                  href="tel:+447570224173"
                  className="border border-gray-700 bg-white/5 px-4 py-3 text-sm leading-6 text-gray-300 transition-colors hover:bg-white/10"
                >
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Phone
                  </span>
                  +447 570 224 173
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 bg-[#ece8df] px-6 py-10 dark:bg-[#0f1315] sm:px-10">
              <Link href="/contact">
                <Button className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                  Talk to our team
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="ghost"
                  className="h-11 w-full rounded-none border border-gray-300 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Learn about us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}