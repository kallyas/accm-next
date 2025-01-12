"use client";

import { useState, useMemo } from "react";
import { TeamMemberCard } from "@/components/team-member-card";
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
    expertise: [
      "Software Development",
      "Web Development",
      "Mobile Development",
    ],
    about:
      "A passionate problem solver with a keen interest in data management and high-performance computing, Emmilly is a driven computer scientist from Uganda. With a strong academic background from Makerere University, where she graduated as the Valedictorian in 2023, Emmilly is adept in a range of technologies, including Flutter, React, AWS, and cloud computing. Her career spans across prestigious institutions such as CERN and the Max Planck Institute, where she gained valuable experience in machine learning, database systems, and accessibility. Emmilly is not only a dedicated researcher but also a firm believer in empowering others through technology. As a volunteer facilitator, she has taught women coding skills to help them break into tech. Her notable achievements include being the 1st Runner-up at the MTN MoMo Hackathon and contributing to high-impact projects like MpaMpe and Khusoma. Emmilly is always eager to learn, innovate, and contribute to solving real-world challenges through technology.",
    imageUrl: "/team/emily.jpeg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      email: "john@example.com",
    },
  },
  {
    id: "2",
    name: "Tim Kajumba",
    position: "Data Analysis Officer",
    department: "Engineering",
    expertise: ["Data Analysis", "Data Visualization", "Machine Learning"],
    about:
      "A data analysis officer specialized in collecting, processing, and performing statistical analyses on large datasets to discover useful information, suggest conclusions, and support decision-making. Using various techniques under various umbrellas, such as descriptive statistics, exploratory data analysis (EDA), and inferential statistics, to interpret and understand the patterns and behaviors within data.",
    imageUrl: "/team/tim.jpeg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/janesmith",
      twitter: "https://twitter.com/janesmith",
      email: "janesmith@gmail.com",
    },
  },
  {
    id: "3",
    name: "Bainomugisha Bernadatte",
    position: "Communications Officer",
    department: "Marketing",
    expertise: ["Content Strategy", "Brand Management", "Digital Marketing"],
    about:
      "I have witnessed firsthand the transformative power of career guidance and how it can redirect someone's life. That's why I am so passionate about my work with the African Centre for Career Mentorship (ACCM). As a Communication Officer, I am driven by a sense of purpose to help others find their way, to empower them with the knowledge and confidence to pursue their dreams. Every message I craft, every word I write, is a chance to make a real difference. I believe that everyone deserves to find fulfillment and purpose in their career, and I am honored to be a part of that journey.",
    imageUrl: "/team/berna.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/alicejohnson",
      twitter: "https://twitter.com/alicejohnson",
      email: "alice@gmail.com",
    },
  },
  {
    id: "4",
    name: "Abel Wilson Walekhwa",
    position: "A Public Health Specialist",
    department: "Health",
    expertise: ["Public Health", "Health Policy", "Health Promotion"],
    about: `He is the visionary founder of the African Centre for Career Mentorship, a pioneering organization dedicated to empowering African professionals and students to excel in their careers and academic pursuits. Through personalized mentorship programs, strategic career guidance, and comprehensive scholarship application support, he has helped hundreds of individuals transform their professional trajectories.
 `,
    imageUrl: "/team/abel.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/bobwilliams",
      twitter: "https://twitter.com/bobwilliams",
      email: "bob@gmail.com",
    },
  },
  {
    id: "5",
    name: "Isabella Atuganyire",
    position: "Chief Executive Officer",
    department: "Management",
    expertise: ["Leadership", "Strategic Planning", "Business Development"],
    about: `She is the chief Executive officer at the African Centre for Career Mentorship where she supports professionals and students discover their full potential for success at workplaces and winning international scholarships.`,
    imageUrl: "/team/isabella.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjones",
      twitter: "https://twitter.com/sarahjones",
      email: "isa@gmail.com",
    },
  },
  {
    id: "6",
    name: "Harriet Ocitti",
    position: "A proficient and passionate communication coach",
    department: "Communication",
    expertise: [
      "Public Speaking",
      "Communication Skills",
      "Presentation Skills",
    ],
    about: `Executive Director at the Institute for National Transformation (INT), whose mission is to develop no-excuse leaders who will transform their spheres of influence to greater levels of performance and excellence..`,
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
    expertise: [
        "Public Speaking",
        "Communication Skills",
        "Presentation Skills",
    ],
    about: `Lead HR-Learning and Development at Wagagai Limited, one of the largest horticulture farms in Uganda.`,
    imageUrl: "/team/birungi.png",
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

  // Get unique departments
  const departments = useMemo(() => {
    const deps = new Set(teamMembers.map((member) => member.department));
    return Array.from(deps);
  }, []);

  // Filter team members
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

  // Group members by department
  const groupedMembers = useMemo(() => {
    return filteredMembers.reduce((acc, member) => {
      if (!acc[member.department]) {
        acc[member.department] = [];
      }
      acc[member.department].push(member);
      return acc;
    }, {} as Record<string, TeamMember[]>);
  }, [filteredMembers]);

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
        <p className="text-xl text-muted-foreground">
          Get to know the passionate individuals driving our mission forward.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-[180px]">
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
            <div className="flex gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredMembers.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} team members
          </p>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No team members found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {view === "grid" ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMembers).map(([department, members]) => (
            <div key={department}>
              <h2 className="text-2xl font-bold mb-4">{department}</h2>
              <div className="space-y-4">
                {members.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
