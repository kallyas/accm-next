"use client";

import { useState, useMemo } from "react";
import { TeamMemberCard as TeamMemberCardComponent } from "@/components/team-member-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, Building, Grid, List } from "lucide-react";
import { motion } from "framer-motion";
import { TeamMember } from "@/types/general";

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Emilly Immaculate",
    position: "Software Developer",
    department: "Engineering",
    expertise: ["Software Development", "Web Development", "Mobile Development"],
    about:
      "A passionate problem solver with a keen interest in data management and high-performance computing, Emmilly is a driven computer scientist from Uganda.",
    imageUrl: "/team/emily.jpeg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      email: "emmillynamugaga@gmail.com",
    },
  },
  {
    id: "2",
    name: "Tim Kajumba",
    position: "Data Analysis Officer",
    department: "Engineering",
    expertise: ["Data Analysis", "Data Visualization", "Machine Learning"],
    about:
      "A data analysis officer specialized in collecting, processing, and performing statistical analyses on large datasets to discover useful information.",
    imageUrl: "/team/tim.jpeg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/janesmith",
      twitter: "https://twitter.com/janesmith",
      email: "janesmith@gmail.com",
    },
  },
  {
    id: "4",
    name: "Abel Wilson Walekhwa",
    position: "Founder and CEO",
    department: "Leadership",
    expertise: ["Public Health", "Health Policy", "Health Promotion"],
    about: `Abel Wilson Walekhwa helps professionals and prospective students discover their potential for success. This is done through tools and frameworks that he has developed over the last four years under African Centre for Career Mentorship.`,
    imageUrl: "/team/abel.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/abel-w-walekhwa-81b249a5",
      twitter: "https://x.com/abelwalekhwa",
      email: "wabelwilson@gmail.com",
    },
  },
  {
    id: "6",
    name: "Harriet Ocitti",
    position: "Communication Coach",
    department: "Communication",
    expertise: ["Public Speaking", "Communication Skills", "Presentation Skills"],
    about: `Executive Director at the Institute for National Transformation (INT), whose mission is to develop no-excuse leaders.`,
    imageUrl: "/team/harriet.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjones",
      twitter: "https://twitter.com/sarahjones",
      email: "isa@gmail.com",
    },
  },
  {
    id: "7",
    name: "Evalyne Birungi",
    position: "Learning and Development Specialist",
    department: "Learning and Development",
    expertise: ["Public Speaking", "Communication Skills", "Presentation Skills"],
    about: `Lead HR-Learning and Development at Wagagai Limited, one of the largest horticulture farms in Uganda.`,
    imageUrl: "/team/birungi.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjones",
      twitter: "https://twitter.com/sarahjones",
      email: "isa@gmail.com",
    },
  },
  {
    id: "8",
    name: "Dr. Jean-Vincent LAMIEN",
    position: "ACCM Ambassador - West Africa",
    department: "Ambassadors",
    expertise: ["Public Health", "Health Policy", "Health Promotion"],
    about: `A medical doctor and public health professional from Burkina Faso, currently pursuing an MSc in Public Health at the Institute of Tropical Medicine in Antwerp, Belgium.`,
    imageUrl: "/team/jeans.jpeg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjones",
      twitter: "https://twitter.com/sarahjones",
      email: "isa@gmail.com",
    },
  },
];

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const departments = useMemo(() => {
    const deps = new Set(teamMembers.map((member) => member.department));
    return Array.from(deps);
  }, []);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.about.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        member.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400"
              >
                Our team
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.1vw,3.7rem)] font-semibold uppercase leading-[0.98]"
              >
                Meet the people behind ACCM.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                Dedicated professionals working to transform career mentorship
                across Africa.
              </motion.p>
            </div>
            <div className="flex items-center justify-center bg-[#171b1d] px-7 py-10 text-gray-100 sm:px-10">
              <p className="text-sm leading-8 text-gray-300">
                {teamMembers.length} team members across {departments.length}{" "}
                departments working together to build the future of career
                mentorship.
              </p>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-8 dark:border-gray-800 md:py-10">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-grow max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-none border-gray-300 bg-white pl-10 dark:border-gray-700 dark:bg-[#111416]"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-[180px] rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]">
                <Building className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="h-10 rounded-none border border-gray-300 dark:border-gray-700"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="h-10 rounded-none border border-gray-300 dark:border-gray-700"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {filteredMembers.length > 0 && (
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Showing {filteredMembers.length} team members
            </p>
          )}
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-20">
          {filteredMembers.length === 0 ? (
            <div className="border border-gray-300 bg-white/70 p-12 text-center dark:border-gray-800 dark:bg-[#171b1d]">
              <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold uppercase">
                No team members found
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("all");
                }}
                className="mt-6 h-10 rounded-none bg-gray-900 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Clear filters
              </Button>
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member, index) => (
                <TeamMemberCardComponent
                  key={member.id}
                  member={member}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(
                filteredMembers.reduce((acc, member) => {
                  if (!acc[member.department]) {
                    acc[member.department] = [];
                  }
                  acc[member.department].push(member);
                  return acc;
                }, {} as Record<string, TeamMember[]>)
              ).map(([department, members]) => (
                <div key={department}>
                  <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                    {department}
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {members.map((member) => (
                      <TeamMemberCardComponent
                        key={member.id}
                        member={member}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}