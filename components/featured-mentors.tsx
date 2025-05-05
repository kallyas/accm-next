"use client";

import React, {  } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// ================ FEATURED MENTORS COMPONENT ================

const mentors = [
  {
    name: "Abel Wilson Walekhwa",
    role: "Founder & Lead Mentor",
    image: "/mentors/banner-image.jpeg",
    expertise: "Career Development, Leadership",
    bio: "Passionate about empowering professionals to achieve their career goals through targeted mentorship and strategic guidance.",
    social: {
      linkedin: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
      email: "abel@africanccm.com"
    }
  },
  {
    name: "Birungi Evelyne",
    role: "Learning and Development Specialist",
    image: "/mentors/Picture2.png",
    expertise: "Financial Literacy, Trainer of Trainees",
    bio: "Expert in financial education with over 8 years of experience developing training programs that drive sustainable professional growth.",
    social: {
      linkedin: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
      email: "evelyne@africanccm.com"
    }
  },
  {
    name: "Harriet Ocitti",
    role: "Communication Coach",
    image: "/mentors/harriet.jpg",
    expertise: "Public Speaking, Leadership Skills",
    bio: "Dedicated to helping individuals master the art of communication, build confidence, and develop powerful leadership presence.",
    social: {
      linkedin: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally",
      email: "harriet@africanccm.com"
    }
  },
];

export function FeaturedMentors() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {mentors.map((mentor, index) => (
        <motion.div
          key={mentor.name}
          variants={itemVariants}
          className="h-full"
        >
          <Card className="group h-full hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-blue-100 dark:border-blue-900/50 relative">
            {/* Glowing effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            <div className="relative h-full flex flex-col">
              <CardHeader className="relative p-6 pb-0">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative inline-block">
                    {/* Mentor image with gradient border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                    <div className="relative size-28 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent font-bold group-hover:scale-105 transition-transform">
                      {mentor.name}
                    </CardTitle>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {mentor.role}
                    </p>
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium">
                      {mentor.expertise}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 pt-4 flex-grow flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center italic mt-4 mb-6 flex-grow">
                  "{mentor.bio}"
                </p>
                
                {/* Social links */}
                <div className="flex justify-center space-x-3 pt-2 mt-auto">
                  <SocialButton href={mentor.social.linkedin} icon={<Linkedin className="size-4" />} label="LinkedIn" />
                  <SocialButton href={mentor.social.twitter} icon={<Twitter className="size-4" />} label="Twitter" />
                  <SocialButton href={`mailto:${mentor.social.email}`} icon={<Mail className="size-4" />} label="Email" />
                </div>
              </CardContent>
              
              {/* Connect button */}
              <div className="px-6 pb-6">
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Link href={`/mentors/${mentor.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center justify-center gap-2">
                    Connect with {mentor.name.split(' ')[0]}
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Social media button component
function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex items-center justify-center size-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}
