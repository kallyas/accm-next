"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  GraduationCap,
  LinkedinIcon,
  TwitterIcon,
  MailIcon,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Abel's information
const mentor = {
  id: 1,
  name: "Abel Wilson Walekhwa",
  title: "Founder & Lead Mentor",
  image: "/mentors/banner-image.jpeg",
  expertise: ["Career Development", "4WFramework", "Leadership"],
  bio: "Walekhwa is the founder of African Centre for Career Mentorship and developer of the 4WFramework. With over 15 years of experience in career counseling, he has helped thousands of professionals across Africa realize their potential.",
  fullBio:
    "Abel Wilson Walekhwa is a dedicated professional with extensive experience in career development and mentorship. After identifying a significant gap between education and industry needs, he founded the African Centre for Career Mentorship to bridge this divide. Through his innovative 4WFramework methodology, Abel has transformed the career trajectories of countless professionals across the continent.\n\nHis approach focuses on personalized guidance that acknowledges each individual's unique strengths and challenges. Abel's work spans across multiple sectors, providing mentorship to both early-career professionals and established leaders seeking to maximize their impact.",
  achievements: [
    "Developed the 4WFramework for career development",
    "Mentored over 5,000 professionals across Africa",
    "Led career development programs in 10+ countries",
    "Established partnerships with major corporations and educational institutions",
  ],
  education: [
    {
      degree: "Master's in Human Resource Development",
      institution: "Makerere University",
    },
    { degree: "Bachelor's in Education", institution: "Kyambogo University" },
  ],
  contact: {
    email: "abel@africanccm.com",
    linkedin:
      "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
    twitter: "https://x.com/mentorglobally",
  },
  // Additional booking-specific information
  sessionTypes: [
    {
      id: "30min",
      name: "Career Clarity Session",
      duration: "30 minutes",
      price: "FREE",
      description:
        "A focused session to identify your core career challenges and create an action plan for growth.",
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
  const [selectedSessionType, setSelectedSessionType] = useState(
    mentor.sessionTypes[0]
  );
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("about");
  const { resolvedTheme } = useTheme();
  const calendlyRef = useRef<HTMLDivElement>(null);

  // Load Calendly widget
  useEffect(() => {
    setIsCalendlyLoaded(false);

    if (!window.Calendly) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => initializeCalendly();
      document.body.appendChild(script);

      return () => {
        if (script && script.parentNode) {
          document.body.removeChild(script);
        }
      };
    } else {
      initializeCalendly();
    }
  }, [selectedSessionType, resolvedTheme]);

  // Initialize Calendly
  const initializeCalendly = () => {
    if (window.Calendly && calendlyRef.current) {
      // Clear the previous widget
      calendlyRef.current.innerHTML = "";

      // Initialize new widget
      window.Calendly.initInlineWidget({
        url: selectedSessionType.calendlyUrl,
        parentElement: calendlyRef.current,
        prefill: {},
        colorScheme: resolvedTheme === "dark" ? "dark" : "light",
      });

      // Style the iframe once it's loaded
      const checkIframe = setInterval(() => {
        const iframe = document.querySelector("iframe");
        if (iframe) {
          iframe.style.borderRadius = "0.5rem";
          iframe.style.backgroundColor =
            resolvedTheme === "dark" ? "#1e1e2e" : "#ffffff";
          iframe.onload = () => setIsCalendlyLoaded(true);
          clearInterval(checkIframe);
        }
      }, 300);
    }
  };

  // Paragraphs from fullBio
  const bioParagraphs = mentor.fullBio.split("\n\n");

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-950/30 dark:to-transparent -z-10" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-10 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl dark:bg-blue-400/5" />
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl dark:bg-teal-400/5" />
      </div>

      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* Header section */}
          <header className="text-center max-w-3xl mx-auto">
            <motion.h1
              className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Book a Session with Abel
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Get personalized career guidance from a leading industry expert
            </motion.p>
          </header>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Mentor profile column */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                  {/* Profile header with image */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h2 className="text-xl font-bold">{mentor.name}</h2>
                      <p className="text-white/90">{mentor.title}</p>
                    </div>
                  </div>

                  {/* Tabs for profile sections */}
                  <Tabs
                    defaultValue="about"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <div className="px-4">
                      <TabsList className="w-full grid grid-cols-3 mt-4">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="achievements">
                          Achievements
                        </TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                      </TabsList>
                    </div>

                    <ScrollArea className="h-[350px]">
                      {/* About tab */}
                      <TabsContent value="about" className="p-4 mt-0">
                        <div className="space-y-4">
                          {bioParagraphs.map((paragraph, idx) => (
                            <p
                              key={idx}
                              className="text-sm text-muted-foreground"
                            >
                              {paragraph}
                            </p>
                          ))}

                          <Separator className="my-4" />

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                              {mentor.expertise.map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Education</h3>
                            <ul className="space-y-2">
                              {mentor.education.map((edu, idx) => (
                                <li key={idx} className="flex items-start">
                                  <GraduationCap className="h-4 w-4 mt-0.5 mr-2 text-blue-500" />
                                  <div className="text-sm">
                                    <p className="font-medium">{edu.degree}</p>
                                    <p className="text-muted-foreground">
                                      {edu.institution}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Achievements tab */}
                      <TabsContent value="achievements" className="p-4 mt-0">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Abel Wilson Walekhwa has established himself as a
                            leader in career development across Africa with
                            notable accomplishments:
                          </p>

                          <ul className="space-y-3">
                            {mentor.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 text-green-500" />
                                <span className="text-sm">{achievement}</span>
                              </li>
                            ))}
                          </ul>

                          <Separator className="my-4" />

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {mentor.stats.totalSessions}+
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Mentoring Sessions
                              </div>
                            </div>
                            <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                {mentor.stats.experience}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Years Experience
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Contact tab */}
                      <TabsContent value="contact" className="p-4 mt-0">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Connect with Abel directly through any of these
                            channels:
                          </p>

                          <ul className="space-y-3">
                            <li className="flex items-center">
                              <MailIcon className="h-5 w-5 mr-3 text-blue-500" />
                              <a
                                href={`mailto:${mentor.contact.email}`}
                                className="text-sm hover:underline"
                              >
                                {mentor.contact.email}
                              </a>
                            </li>
                            <li className="flex items-center">
                              <LinkedinIcon className="h-5 w-5 mr-3 text-blue-500" />
                              <a
                                href={mentor.contact.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:underline"
                              >
                                LinkedIn Profile
                              </a>
                            </li>
                            <li className="flex items-center">
                              <TwitterIcon className="h-5 w-5 mr-3 text-blue-500" />
                              <a
                                href={mentor.contact.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:underline"
                              >
                                Twitter/X Profile
                              </a>
                            </li>
                          </ul>

                          <Separator className="my-4" />

                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h3 className="text-sm font-medium mb-2">
                              Response Time
                            </h3>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="text-sm">
                                {mentor.stats.response}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </Card>
              </motion.div>
            </div>

            {/* Booking column */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      Select a Session Type
                    </CardTitle>
                    <CardDescription>
                      Choose the format that best suits your needs
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Session type selection */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {mentor.sessionTypes.map((sessionType) => (
                        <Card
                          key={sessionType.id}
                          className={`flex-1 cursor-pointer transition-all duration-300 hover:shadow-md ${
                            selectedSessionType.id === sessionType.id
                              ? "border-blue-500 dark:border-blue-400 ring-1 ring-blue-500 dark:ring-blue-400"
                              : "hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                          onClick={() => setSelectedSessionType(sessionType)}
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium">
                                  {sessionType.name}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {sessionType.duration}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  sessionType.price === "FREE"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {sessionType.price === "FREE"
                                  ? "Free"
                                  : sessionType.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {sessionType.description}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Separator />

                    {/* Calendly widget */}
                    <div className="relative">
                      {/* Loading skeleton */}
                      <AnimatePresence>
                        {!isCalendlyLoaded && (
                          <motion.div
                            className="absolute inset-0 z-10 bg-card"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="p-4 space-y-4">
                              <Skeleton className="h-10 w-full" />
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
                                    <Skeleton key={i} className="h-12 w-full" />
                                  ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Calendly widget */}
                      <div
                        ref={calendlyRef}
                        className="rounded-lg overflow-hidden min-h-[580px]"
                        style={{ height: "630px" }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonials and additional info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-6"
                >
                  <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-medium">
                            What to Expect
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                              <span className="text-sm">
                                Tailored guidance using the 4WFramework
                              </span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                              <span className="text-sm">
                                Actionable next steps for your career growth
                              </span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                              <span className="text-sm">
                                Direct access to Abel's expertise and network
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-medium">
                            How to Prepare
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                              <span className="text-sm">
                                Have your resume/CV available for reference
                              </span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                              <span className="text-sm">
                                Prepare specific questions about your career
                                path
                              </span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 mt-1 mr-2 text-green-500" />
                              <span className="text-sm">
                                Be ready to discuss your goals and challenges
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
