"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: object;
        styles?: { height: string };
      }) => void;
    };
  }
}

import {
  Clock,
  GraduationCap,
  Linkedin,
  Twitter,
  Mail,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const mentor = {
  id: 1,
  name: "Abel Wilson Walekhwa",
  title: "Founder & Lead Mentor",
  image: "/mentors/banner-image.jpeg",
  expertise: ["Career Development", "4WFramework", "Leadership"],
  bio: "Walekhwa is the founder of African Centre for Career Mentorship and developer of the 4WFramework. With over 15 years of experience in career counseling, he has helped thousands of professionals across Africa realize their potential.",
  fullBio: "Abel Wilson Walekhwa is a dedicated professional with extensive experience in career development and mentorship. After identifying a significant gap between education and industry needs, he founded the African Centre for Career Mentorship to bridge this divide. Through his innovative 4WFramework methodology, Abel has transformed the career trajectories of countless professionals across the continent.\n\nHis approach focuses on personalized guidance that acknowledges each individual's unique strengths and challenges. Abel's work spans across multiple sectors, providing mentorship to both early-career professionals and established leaders seeking to maximize their impact.",
  achievements: [
    "Developed the 4WFramework for career development",
    "Mentored over 5,000 professionals across Africa",
    "Led career development programs in 10+ countries",
    "Established partnerships with major corporations",
  ],
  education: [
    { degree: "Master's in Human Resource Development", institution: "Makerere University" },
    { degree: "Bachelor's in Education", institution: "Kyambogo University" },
  ],
  contact: {
    email: "abel@africanccm.com",
    linkedin: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
    twitter: "https://x.com/mentorglobally",
  },
  sessionTypes: [
    {
      id: "30min",
      name: "Career Clarity Session",
      duration: "30 minutes",
      price: "FREE",
      description: "A focused session to identify your core career challenges and create an action plan for growth.",
      calendlyUrl: "https://calendly.com/abelwalekhwa_accm/30min",
    },
  ],
  stats: {
    rating: 4.9,
    totalSessions: 5000,
    experience: "15+ years",
    response: "Within 24 hours",
  },
};

export default function BookSessionPage() {
  const [selectedSessionType, setSelectedSessionType] = useState(mentor.sessionTypes[0]);
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("about");
  const calendlyRef = useRef<HTMLDivElement>(null);

  const bioParagraphs = mentor.fullBio.split("\n\n");

  // Load Calendly widget
  useEffect(() => {
    const initCalendly = () => {
      if (window.Calendly && calendlyRef.current) {
        calendlyRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: selectedSessionType.calendlyUrl,
          parentElement: calendlyRef.current,
          prefill: {},
          styles: { height: "500px" },
        });
        setIsCalendlyLoaded(true);
      }
    };

    if (!window.Calendly) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initCalendly;
      document.body.appendChild(script);
    } else {
      initCalendly();
    }
  }, [selectedSessionType.calendlyUrl]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[88rem]">
        <header className="px-5 py-8 sm:px-7 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center border border-[#1A1B4B] bg-[#1A1B4B]">
              <span className="text-lg font-semibold uppercase text-white">A</span>
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1A1B4B]">
              ACCM
            </span>
          </Link>
        </header>

        <main className="px-5 pb-16 sm:px-7 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-5"
            >
              <div className="sticky top-8">
                <div className="mb-8">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
                    <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
                    1-on-1 Mentorship
                  </p>
                  <h1 className="mt-4 text-balance text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.98] text-[#1A1B4B]">
                    Book a session with Abel
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-[#1A1B4B]/60">
                    Get personalized career guidance from a leading industry expert using our proven 4WFramework methodology.
                  </p>
                </div>

                <Card className="border border-[#1A1B4B]/20 bg-white">
                  <div className="aspect-[16/9] relative overflow-hidden border-b border-[#1A1B4B]/10">
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B4B]/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-xl font-semibold uppercase text-white">
                        {mentor.name}
                      </h2>
                      <p className="text-xs uppercase tracking-wider text-white/70">
                        {mentor.title}
                      </p>
                    </div>
                  </div>

                  <Tabs
                    defaultValue="about"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <div className="px-4">
                      <TabsList className="w-full grid grid-cols-3 mt-4">
                        <TabsTrigger value="about" className="text-xs uppercase tracking-wider">
                          About
                        </TabsTrigger>
                        <TabsTrigger value="achievements" className="text-xs uppercase tracking-wider">
                          Results
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="text-xs uppercase tracking-wider">
                          Contact
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <ScrollArea className="h-[280px]">
                      <TabsContent value="about" className="p-4 mt-0 space-y-4">
                        {bioParagraphs.map((paragraph, idx) => (
                          <p key={idx} className="text-xs leading-relaxed text-[#1A1B4B]/60">
                            {paragraph}
                          </p>
                        ))}

                        <Separator className="my-4" />

                        <div className="space-y-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B]">
                            Expertise
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-[0.6rem] uppercase tracking-wider border-[#1A1B4B]/30 text-[#1A1B4B]"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B]">
                            Education
                          </h3>
                          <ul className="space-y-2">
                            {mentor.education.map((edu, idx) => (
                              <li key={idx} className="flex items-start">
                                <GraduationCap className="h-4 w-4 mt-0.5 mr-2 text-[#1A1B4B]/50" />
                                <div className="text-xs">
                                  <p className="font-medium text-[#1A1B4B]">{edu.degree}</p>
                                  <p className="text-[#1A1B4B]/50">{edu.institution}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="achievements" className="p-4 mt-0 space-y-6">
                        <p className="text-xs text-[#1A1B4B]/60">
                          Abel Wilson Walekhwa has established himself as a leader in career development across Africa with notable accomplishments:
                        </p>

                        <ul className="space-y-3">
                          {mentor.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 text-[#26A649]" />
                              <span className="text-xs text-[#1A1B4B]/70">
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-4">
                          <div className="border border-[#1A1B4B]/10 p-3">
                            <div className="text-2xl font-semibold text-[#1A1B4B]">
                              {mentor.stats.totalSessions}+
                            </div>
                            <div className="text-[0.6rem] uppercase tracking-wider text-[#1A1B4B]/50">
                              Sessions
                            </div>
                          </div>
                          <div className="border border-[#1A1B4B]/10 p-3">
                            <div className="text-2xl font-semibold text-[#1A1B4B]">
                              {mentor.stats.experience}
                            </div>
                            <div className="text-[0.6rem] uppercase tracking-wider text-[#1A1B4B]/50">
                              Experience
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="contact" className="p-4 mt-0 space-y-4">
                        <p className="text-xs text-[#1A1B4B]/60">
                          Connect with Abel directly through any of these channels:
                        </p>

                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <Mail className="h-4 w-4 mr-3 text-[#1A1B4B]/50" />
                            <a
                              href={`mailto:${mentor.contact.email}`}
                              className="text-xs hover:underline text-[#1A1B4B]"
                            >
                              {mentor.contact.email}
                            </a>
                          </li>
                          <li className="flex items-center">
                            <Linkedin className="h-4 w-4 mr-3 text-[#1A1B4B]/50" />
                            <a
                              href={mentor.contact.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs hover:underline text-[#1A1B4B]"
                            >
                              LinkedIn Profile
                            </a>
                          </li>
                          <li className="flex items-center">
                            <Twitter className="h-4 w-4 mr-3 text-[#1A1B4B]/50" />
                            <a
                              href={mentor.contact.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs hover:underline text-[#1A1B4B]"
                            >
                              Twitter/X
                            </a>
                          </li>
                        </ul>

                        <Separator className="my-4" />

                        <div className="border border-[#1A1B4B]/10 p-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B] mb-2">
                            Response Time
                          </h3>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-[#1A1B4B]/50" />
                            <span className="text-xs text-[#1A1B4B]/60">
                              {mentor.stats.response}
                            </span>
                          </div>
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7"
            >
              <div className="space-y-6 lg:space-y-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {mentor.sessionTypes.map((sessionType, index) => (
                    <div
                      key={sessionType.id}
                      className={`cursor-pointer border p-4 transition-colors ${
                        selectedSessionType.id === sessionType.id
                          ? "border-[#1A1B4B] bg-white"
                          : "border-[#1A1B4B]/20 bg-[#ece8df]/30 hover:border-[#1A1B4B]/40"
                      } ${index === 1 ? "lg:translate-y-4" : ""}`}
                      onClick={() => setSelectedSessionType(sessionType)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1A1B4B]">
                            {sessionType.name}
                          </h3>
                          <p className="text-xs text-[#1A1B4B]/50 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {sessionType.duration}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[0.6rem] uppercase tracking-wider border-[#26A649]/30 text-[#26A649]"
                        >
                          {sessionType.price}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#1A1B4B]/60">
                        {sessionType.description}
                      </p>
                    </div>
                  ))}
                </div>

                <Card className="border border-[#1A1B4B]/20 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wider text-[#1A1B4B]">
                      Select a time slot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="!p-0">
                    <div className="relative [&_.calendly-inline-widget]:min-h-[600px]">
                      <AnimatePresence>
                        {!isCalendlyLoaded && (
                          <motion.div
                            className="absolute inset-0 z-10 bg-white p-4"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="p-4 space-y-4">
                              <Skeleton className="h-8 w-full" />
                              <div className="grid grid-cols-7 gap-2">
                                {Array(7)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-full" />
                                  ))}
                              </div>
                              <div className="space-y-2 mt-6">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                  ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div
                        ref={calendlyRef}
                        className="calendly-inline-widget"
                        style={{ minHeight: "600px", height: "600px" }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="border border-[#1A1B4B]/10 p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B] mb-4">
                      What to expect
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Tailored guidance using the 4WFramework",
                        "Actionable next steps for your career",
                        "Direct access to Abel's expertise",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 text-[#26A649]" />
                          <span className="text-xs text-[#1A1B4B]/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-[#1A1B4B]/10 p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1B4B] mb-4">
                      How to prepare
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Have your CV available for reference",
                        "Prepare questions about your career path",
                        "Be ready to discuss your goals",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 text-[#26A649]" />
                          <span className="text-xs text-[#1A1B4B]/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}