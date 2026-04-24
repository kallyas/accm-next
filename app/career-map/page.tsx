"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CareerMapGame } from "@/components/career-map-game";
import {
  Briefcase,
  GraduationCap,
  Target,
  Lightbulb,
  MoveUp,
  BarChart,
  Users,
  Clock,
  UserCheck,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: "10", label: "Minutes" },
  { value: "30+", label: "Careers matched" },
  { value: "Personal", label: "Insights" },
];

const features = [
  {
    icon: GraduationCap,
    title: "Educational Guidance",
    description:
      "Get clear pathways and educational requirements for each career match.",
  },
  {
    icon: Target,
    title: "Skills Analysis",
    description:
      "Identify your core competencies and discover careers that leverage your strengths.",
  },
  {
    icon: Lightbulb,
    title: "Career Insights",
    description: "Access up-to-date information on salary ranges and growth outlook.",
  },
  {
    icon: BarChart,
    title: "Actionable Results",
    description: "Receive detailed career matches with compatibility scores.",
  },
];

const steps = [
  {
    number: "01",
    title: "Complete Assessment",
    description: "Answer questions about your background, skills, and interests.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our algorithm analyzes your responses for suitable matches.",
  },
  {
    number: "03",
    title: "Get Results",
    description: "Receive detailed career matches with insights.",
  },
  {
    number: "04",
    title: "Take Action",
    description: "Use the guidance to explore your career options.",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Software Engineer",
    quote:
      "The assessment was so detailed! It matched me with roles I had never considered but that aligned perfectly with my skills.",
  },
  {
    name: "Alex M.",
    role: "UX Researcher",
    quote:
      "After feeling stuck in my career, CareerMap showed me options that combined my analytical skills with my passion.",
  },
];

export default function CareerMapPage() {
  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400"
              >
                <Target className="h-3.5 w-3.5" />
                Free assessment tool
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.1vw,3.7rem)] font-semibold uppercase leading-[0.98]"
              >
                Discover your ideal career path.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                Take our comprehensive assessment to find careers that match your
                unique skills, interests, and aspirations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-8"
              >
                <Button
                  className="h-11 rounded-none bg-gray-900 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                  onClick={() => {
                    const el = document.getElementById("assessment");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Start assessment
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <div className="grid gap-4 p-7 dark:bg-[#171b1d] sm:p-10 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                  className={`border border-gray-300 bg-white/70 p-4 dark:border-gray-800 dark:bg-[#121518] ${
                    index === 1 ? "sm:translate-y-4" : ""
                  }`}
                >
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mb-10">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Why CareerMap
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Your career journey starts here.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d] ${
                  index === 1 ? "lg:translate-y-6" : ""
                } ${index === 3 ? "lg:-translate-y-3" : ""}`}
              >
                <feature.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.03em]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mb-10">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              How it works
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Simple steps to discover your path.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d] ${
                  index === 1 ? "lg:translate-y-6" : ""
                } ${index === 2 ? "lg:-translate-y-4" : ""}`}
              >
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  {step.number}
                </p>
                <h3 className="mt-3 text-base font-semibold uppercase tracking-[0.03em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mb-10">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Success stories
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Hear from those who discovered their path.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d] ${
                  index === 1 ? "md:translate-y-6" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Users className="mt-1 h-5 w-5 flex-shrink-0 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                      "{testimonial.quote}"
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {testimonial.name} · {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section
          id="assessment"
          className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20"
        >
          <div className="mb-10 text-center">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Assessment
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Start your career assessment.
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
              Take approximately 10 minutes to discover your ideal career path.
            </p>
          </div>
          <CareerMapGame />
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          <div className="mb-10">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Common questions
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Frequently asked questions.
            </h2>
          </div>

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-8 h-auto flex-wrap justify-start gap-2 bg-transparent p-0 dark:bg-transparent">
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-gray-50 rounded-none border border-gray-300 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] data-[state=active]:border-gray-900 dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 dark:data-[state=active]:border-gray-100"
              >
                About the Assessment
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-gray-50 rounded-none border border-gray-300 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] data-[state=active]:border-gray-900 dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 dark:data-[state=active]:border-gray-100"
              >
                Privacy & Data
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-gray-50 rounded-none border border-gray-300 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] data-[state=active]:border-gray-900 dark:data-[state=active]:bg-gray-100 dark:data-[state=active]:text-gray-900 dark:data-[state=active]:border-gray-100"
              >
                Understanding Results
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="about"
              className="grid gap-4 md:grid-cols-2"
            >
              {[
                {
                  q: "How does the assessment work?",
                  a: "Our assessment uses a proprietary algorithm that analyzes your responses across multiple dimensions including skills, interests, values, and work preferences.",
                },
                {
                  q: "How long will it take to complete?",
                  a: "Most users complete the assessment in 8-12 minutes. You can save your progress and return later if needed.",
                },
                {
                  q: "Are the results accurate?",
                  a: "Our assessment has been validated through research with thousands of users. Results should be seen as guidance rather than absolute answers.",
                },
                {
                  q: "Do I need to create an account?",
                  a: "An account is not required to take the assessment, but creating one allows you to save your results for future reference.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.03em]">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                    {faq.a}
                  </p>
                </div>
              ))}
            </TabsContent>

            <TabsContent
              value="privacy"
              className="grid gap-4 md:grid-cols-2"
            >
              {[
                {
                  q: "How is my data protected?",
                  a: "Your assessment data is encrypted and stored securely. We never sell your personal information to third parties.",
                },
                {
                  q: "Can I request deletion of my data?",
                  a: "Yes, you can request deletion of your data at any time through your account settings.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.03em]">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                    {faq.a}
                  </p>
                </div>
              ))}
            </TabsContent>

            <TabsContent
              value="results"
              className="grid gap-4 md:grid-cols-2"
            >
              {[
                {
                  q: "How should I interpret my results?",
                  a: "Your results show careers that align with your unique profile, ranked by match percentage.",
                },
                {
                  q: "Can I retake the assessment?",
                  a: "Yes, you can retake the assessment as many times as you want. This can be helpful as your interests evolve.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.03em]">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                    {faq.a}
                  </p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </section>

        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Get started
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Ready to discover your career path?
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                Take the first step toward finding a fulfilling career that
                matches your unique skills and aspirations.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 bg-[#ece8df] px-6 py-10 dark:bg-[#0f1315] sm:px-10">
              <Link href="/register">
                <Button className="h-11 w-full rounded-none bg-gray-900 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                  Create account
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="h-11 w-full rounded-none border border-gray-300 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}