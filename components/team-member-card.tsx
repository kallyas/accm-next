"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeamMember } from "@/types/general";
import { cn } from "@/lib/utils";

export function TeamMemberCard({
  member,
  index = 0,
}: {
  member: TeamMember;
  index?: number;
}) {
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
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B4B]/60 via-transparent to-transparent" />
        </div>
        <div className="p-5">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
            {member.department}
          </p>
          <h3 className="mt-2 text-base font-semibold uppercase leading-tight">
            {member.name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#1A1B4B] ">
            {member.position}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#1A1B4B]  line-clamp-3">
            {member.about}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {member.expertise.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                className="border border-[#1A1B4B]/20 bg-[#FFFFFF] px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider  "
              >
                {skill}
              </Badge>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex gap-1">
              {member.socialLinks?.linkedin && (
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center border border-[#1A1B4B]/20 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10   "
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
              )}
              {member.socialLinks?.twitter && (
                <a
                  href={member.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center border border-[#1A1B4B]/20 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10   "
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
              )}
              {member.socialLinks?.email && (
                <a
                  href={`mailto:${member.socialLinks.email}`}
                  className="flex h-8 w-8 items-center justify-center border border-[#1A1B4B]/20 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10   "
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <Button className="h-9 rounded-none bg-[#1A1B4B]/10 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#FFFFFF] hover:bg-[#1A1B4B]/10   ">
              View profile
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function TeamMemberCardComponent({
  member,
  index = 0,
}: {
  member: TeamMember;
  index?: number;
}) {
  return <TeamMemberCard member={member} index={index} />;
}

