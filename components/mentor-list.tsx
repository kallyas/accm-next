"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Mentor = {
  id: number;
  name: string;
  title: string;
  image: string;
  expertise: string[];
  bio: string;
};

const mentors: Mentor[] = [
  {
    id: 1,
    name: "Abel Wilson Walekhwa",
    title: "Founder & Lead Mentor",
    image: "/mentors/banner-image.jpeg",
    expertise: ["Career Development", "4W Framework", "Leadership"],
    bio: "Walekhwa is the founder of African Centre for Career Mentorship and developer of the 4W Framework. With over 15 years of experience in career counseling, he has helped thousands of professionals across Africa realize their potential.",
  },
  {
    id: 2,
    name: "Birungi Evelyne",
    title: "Learning & Development Specialist",
    image: "/mentors/picture2.png",
    expertise: ["Financial Literacy", "Trainer of T", "HR-L&D"],
    bio: "Evelyne is a Learning and Development specialist currently serving as lead HR-Learning and Development at Wagagai Limited, one of the largest Horticulture farms in Uganda.",
  },
  {
    id: 3,
    name: "Harriet Ocitti",
    title: "Communication Coach",
    image: "/mentors/harriet.jpg",
    expertise: ["Public Speaking", "Leadership", "Coaching"],
    bio: "Harriet Ocitti serves as the Executive Director at the Institute for National Transformation (INT), developing no-excuse leaders who transform their spheres of influence.",
  },
];

function MentorCard({ mentor, index }: { mentor: Mentor; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        "group",
        index % 3 === 1 ? "md:translate-y-8" : "",
        index % 3 === 2 ? "md:-translate-y-4" : ""
      )}
    >
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF]  ">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B4B]/60 via-transparent to-transparent" />
        </div>
        <div className="p-5">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
            {mentor.title}
          </p>
          <h3 className="mt-2 text-base font-semibold uppercase leading-tight">
            {mentor.name}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#1A1B4B]  line-clamp-3">
            {mentor.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {mentor.expertise.map((skill) => (
              <Badge
                key={skill}
                className="border border-[#1A1B4B]/20 bg-[#FFFFFF] px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider  "
              >
                {skill}
              </Badge>
            ))}
          </div>
          <Link
            href="/mentors"
            className="mt-5 flex h-10 w-full items-center justify-center border border-[#1A1B4B]/20 bg-[#FFFFFF] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10    "
          >
            View profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function MentorList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor, index) => (
        <MentorCard key={mentor.id} mentor={mentor} index={index} />
      ))}
    </div>
  );
}