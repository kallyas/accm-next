"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const mentors = [
  {
    name: "Abel Wilson Walekhwa",
    role: "Founder & Lead Mentor",
    image: "/mentors/banner-image.jpeg",
    expertise: "Career Development, Leadership",
    bio: "Passionate about empowering professionals to achieve their career goals through targeted mentorship and strategic guidance.",
    social: {
      linkedin:
        "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
      email: "abel@africanccm.com",
    },
  },
  {
    name: "Birungi Evelyne",
    role: "Learning and Development Specialist",
    image: "/mentors/Picture2.png",
    expertise: "Financial Literacy, Trainer of Trainees",
    bio: "Expert in financial education with over 8 years of experience developing training programs that drive sustainable professional growth.",
    social: {
      linkedin:
        "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
      email: "evelyne@africanccm.com",
    },
  },
  {
    name: "Harriet Ocitti",
    role: "Communication Coach",
    image: "/mentors/harriet.jpg",
    expertise: "Public Speaking, Leadership Skills",
    bio: "Dedicated to helping individuals master the art of communication, build confidence, and develop powerful leadership presence.",
    social: {
      linkedin:
        "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
      email: "harriet@africanccm.com",
    },
  },
];

export function FeaturedMentors() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      {mentors.map((mentor, index) => (
        <motion.article
          key={mentor.name}
          variants={itemVariants}
          className={`group border border-[#1A1B4B]/20 bg-[#FFFFFF] p-4   ${
            index === 1 ? "lg:translate-y-8" : ""
          } ${index === 2 ? "lg:-translate-y-4" : ""}`}
        >
          <div className="relative h-56 overflow-hidden border border-[#1A1B4B]/20 ">
            <Image
              src={mentor.image}
              alt={mentor.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="mt-4 border-l-2 border-[#1A1B4B]/20 pl-3 ">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#1A1B4B]/70 ">
              {mentor.role}
            </p>
            <h3 className="mt-1 text-lg font-semibold uppercase tracking-[0.03em]">
              {mentor.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#1A1B4B]/70 ">
              {mentor.expertise}
            </p>
          </div>

          <p className="mt-4 text-sm leading-7 text-[#1A1B4B] ">
            {mentor.bio}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SocialButton
                href={mentor.social.linkedin}
                icon={<Linkedin className="h-3.5 w-3.5" />}
                label="LinkedIn"
              />
              <SocialButton
                href={mentor.social.twitter}
                icon={<Twitter className="h-3.5 w-3.5" />}
                label="Twitter"
              />
              <SocialButton
                href={`mailto:${mentor.social.email}`}
                icon={<Mail className="h-3.5 w-3.5" />}
                label="Email"
              />
            </div>

            <Button
              asChild
              variant="ghost"
              className="h-9 rounded-none border border-[#1A1B4B]/20 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] hover:bg-[#1A1B4B]/10   "
            >
              <Link
                href={`/mentors/${mentor.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                Connect
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

function SocialButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center border border-[#1A1B4B]/20 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10 hover:text-[#1A1B4B]    "
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}
