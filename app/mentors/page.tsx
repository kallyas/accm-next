"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ElementType } from "react";
import {
  Award,
  CheckCircle,
  ChevronRight,
  Globe,
  GraduationCap,
  LinkedinIcon,
  MailIcon,
  TwitterIcon,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Mentor = {
  id: number;
  name: string;
  title: string;
  image: string;
  expertise: string[];
  bio: string;
  fullBio: string;
  achievements: string[];
  education: {
    degree: string;
    institution: string;
  }[];
  contact: {
    email: string;
    linkedin: string;
    twitter: string;
  };
};

const mentors: Mentor[] = [
  {
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
  },
  {
    id: 2,
    name: "Birungi Evelyne",
    title: "Learning & Development Specialist",
    image: "/mentors/Picture2.png",
    expertise: [
      "Financial Literacy",
      "Trainer of Trainees",
      "HR-Learning and Development",
    ],
    bio: "Evelyne is a Learning and Development specialist currently serving as lead HR-Learning and Development at Wagagai Limited, one of the largest Horticulture farms in Uganda. She has a passion for financial literacy and has trained over 5000 employees in the last 10 years.",
    fullBio:
      "Birungi Evelyne has built her career around empowering others through education and skill development. As a Learning and Development specialist at Wagagai Limited, she has designed and implemented comprehensive training programs that address both technical skills and personal growth.\n\nEvelyne's expertise in financial literacy has been particularly transformative, helping employees at all levels make informed decisions about their financial futures. Her approach combines practical knowledge with actionable strategies, making complex financial concepts accessible to everyone.",
    achievements: [
      "Designed and implemented training programs for over 5,000 employees",
      "Developed a financial literacy curriculum adopted by multiple organizations",
      "Increased employee retention by 35% through targeted development programs",
      "Recipient of the HR Excellence Award for Training Innovation",
    ],
    education: [
      {
        degree: "Master's in Human Resource Management",
        institution: "Uganda Management Institute",
      },
      {
        degree: "Bachelor's in Business Administration",
        institution: "Makerere University Business School",
      },
    ],
    contact: {
      email: "evelyne@africanccm.com",
      linkedin:
        "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
    },
  },
  {
    id: 3,
    name: "Harriet Ocitti",
    title: "Communication Coach",
    image: "/mentors/harriet.jpg",
    expertise: ["Public Speaking", "Leadership Skills", "Communication Coaching"],
    bio: "Harriet Ocitti serves as the Executive Director at the Institute for National Transformation (INT), whose mission is to develop no-excuse leaders who will transform their spheres of influence to greater levels of performance and excellence. She brings a wealth of experience in communication and leadership coaching.",
    fullBio:
      "Harriet Ocitti is a distinguished communication professional who believes in the transformative power of effective communication in leadership. As the Executive Director at the Institute for National Transformation, she works to cultivate leaders who can drive positive change through clear vision and powerful communication.\n\nWith her background in both business and education, Harriet brings a unique perspective to her coaching practice. Her holistic approach addresses not only the technical aspects of communication but also the emotional intelligence and presence that make leaders truly impactful.",
    achievements: [
      "Coached executives from over 50 organizations across East Africa",
      "Developed the 'Communicate to Lead' framework for effective leadership communication",
      "Featured speaker at international leadership conferences",
      "Published author on communication strategies for emerging leaders",
    ],
    education: [
      {
        degree: "Master's in Communication Studies",
        institution: "University of Nairobi",
      },
      {
        degree: "Bachelor's in Business Communication",
        institution: "Makerere University",
      },
    ],
    contact: {
      email: "harriet@africanccm.com",
      linkedin:
        "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
    },
  },
];

const approach = [
  {
    title: "Personalized Assessment",
    description:
      "We start by understanding your strengths, constraints, and long-term goals.",
  },
  {
    title: "Structured Development Plan",
    description:
      "You get a practical roadmap with clear milestones and accountability.",
  },
  {
    title: "Regular Guidance Sessions",
    description:
      "Mentors provide continuous support as you implement and adapt your plan.",
  },
  {
    title: "Network Building",
    description:
      "You connect with experienced practitioners and high-intent peers.",
  },
];

export default function MentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

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
                className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400"
              >
                Mentors
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]"
              >
                Work with experienced professionals who guide outcomes.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                Our mentors combine strategic insight and practical coaching to
                help you move from intention to measurable career growth.
              </motion.p>
            </div>
            <div className="grid grid-cols-3 border-t border-gray-300 bg-[#171b1d] px-6 py-10 text-gray-100 dark:border-gray-800 sm:px-10 lg:border-l lg:border-t-0">
              <Stat value="15+" label="Years experience" icon={Users} />
              <Stat value="10K+" label="Professionals mentored" icon={GraduationCap} />
              <Stat value="10+" label="African countries" icon={Globe} />
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="mb-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Leadership team
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Mentors selected for depth, delivery, and consistency.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor, index) => (
              <article
                key={mentor.id}
                className={`group border border-gray-300 bg-white/70 p-4 dark:border-gray-800 dark:bg-[#171b1d] ${
                  index === 1 ? "lg:translate-y-8" : ""
                } ${index === 2 ? "lg:-translate-y-4" : ""}`}
              >
                <div className="relative h-56 overflow-hidden border border-gray-300 dark:border-gray-700">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 border-l-2 border-gray-300 pl-3 dark:border-gray-700">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                    {mentor.title}
                  </p>
                  <h3 className="mt-1 text-base font-semibold uppercase tracking-[0.04em]">
                    {mentor.name}
                  </h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-none border border-gray-300 bg-transparent px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.1em] text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {mentor.bio}
                </p>
                <Button
                  variant="ghost"
                  className="mt-5 h-9 w-full rounded-none border border-gray-300 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setSelectedMentor(mentor)}
                >
                  View profile
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[18rem] overflow-hidden border border-gray-300 dark:border-gray-800">
              <Image
                src="/accm/IMG_4713.JPG"
                alt="Mentorship session"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Mentorship approach
              </p>
              <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
                Structured support from diagnosis to execution.
              </h2>
              <div className="mt-6 space-y-4">
                {approach.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.06em]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-gray-700 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-7 h-10 rounded-none bg-gray-900 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <Link href="/services">Explore mentorship services</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border border-t-0 border-gray-300 dark:border-gray-800">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Take action
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Start with the mentor best aligned to your growth goals.
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                We help you identify the right fit, then move quickly into
                practical sessions that create measurable progress.
              </p>
            </div>
            <div className="flex items-center justify-center bg-[#ece8df] p-6 dark:bg-[#0f1315] sm:p-10">
              <div className="w-full max-w-sm space-y-3">
                <Button
                  asChild
                  className="h-10 w-full rounded-none bg-gray-900 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  <Link href="/register">Find your mentor</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="h-10 w-full rounded-none border border-gray-300 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Link href="/services">Explore programs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={!!selectedMentor} onOpenChange={() => setSelectedMentor(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-none border-gray-300 bg-[#f7f5f1] dark:border-gray-800 dark:bg-[#111416]">
          {selectedMentor ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold uppercase tracking-[0.06em]">
                  Mentor profile
                </DialogTitle>
                <DialogDescription>Detailed overview and background</DialogDescription>
              </DialogHeader>
              <MentorDetail mentor={selectedMentor} />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MentorDetail({ mentor }: { mentor: Mentor }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d] sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="relative h-28 w-28 overflow-hidden border border-gray-300 dark:border-gray-700">
          <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            {mentor.title}
          </p>
          <h3 className="mt-1 text-xl font-semibold uppercase tracking-[0.03em]">
            {mentor.name}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {mentor.expertise.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="rounded-none border border-gray-300 bg-transparent px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.1em] text-gray-700 dark:border-gray-700 dark:text-gray-300"
              >
                {skill}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href={mentor.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={mentor.contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Twitter profile"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${mentor.contact.email}`}
              className="inline-flex h-8 w-8 items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Email contact"
            >
              <MailIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <Tabs defaultValue="bio" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-none border border-gray-300 bg-white/60 p-1 dark:border-gray-800 dark:bg-[#171b1d]">
          <TabsTrigger
            value="bio"
            className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
          >
            Biography
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
          >
            Education
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bio" className="mt-4">
          <div className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]">
            <p className="whitespace-pre-line text-sm leading-8 text-gray-700 dark:text-gray-300">
              {mentor.fullBio}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <div className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]">
            <ul className="space-y-3">
              {mentor.achievements.map((achievement) => (
                <li key={achievement} className="flex items-start gap-2.5">
                  <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                    {achievement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-4">
          <div className="border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d]">
            <ul className="space-y-3">
              {mentor.education.map((item) => (
                <li key={`${item.degree}-${item.institution}`} className="flex items-start gap-2.5">
                  <GraduationCap className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.04em]">
                      {item.degree}
                    </p>
                    <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {item.institution}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="h-10 rounded-none bg-gray-900 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
          Request mentorship
        </Button>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: ElementType;
}) {
  return (
    <div className="px-2 text-center">
      <Icon className="mx-auto h-4 w-4 text-gray-300" />
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="text-[0.62rem] uppercase tracking-[0.12em] text-gray-400">{label}</p>
    </div>
  );
}
