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
      "As a Communication Officer, I enjoy telling a story and ACCM’s story is one that particularly inspires me. One of the best parts of my work is writing and designing graphics. I have been honored to support ACCM’s social media growth by more than 40 % in less than a year. I have also supported personal brands, growing them by more than 100% in less than three months. I am passionate about communication and growth. Being able to learn and contribute is an enriching experience for me.",
    imageUrl: "/team/berna.png",
    socialLinks: {
      linkedin: "https://ug.linkedin.com/in/bainomugisha-bernadatte-95a98b201",
      twitter: "https://twitter.com/alicejohnson",
      email: "alice@gmail.com",
    },
  },
  {
    id: "4",
    name: "Abel Wilson Walekhwa",
    position: "Founder and CEO",
    department: "Leadership",
    expertise: ["Public Health", "Health Policy", "Health Promotion"],
    about: `Abel Wilson Walekhwa helps professionals and prospective students discover their potential for success. This is done through tools and frameworks that he has developed over the last four years under African Centre for Career Mentorship (Pearl Mentor Hub LTD), a registered non government organization in Uganda. 

Since 2022 to date, he has directly mentored 25 African students from five countries to win fully funded scholarships (7-PhDs, 17-Masters and 1-Bachelor’s degree) to nine different countries globally. 

Through the African Centre for Career Mentorship, he has organized over 70 weekly meetings (zoom webinars) training over 817 professionals and generated over 60 YouTube recordings/videos. The YouTube recordings have attracted over 780 subscribers and 19,870 views since August 6th 2023 when he opened it. 

Given his passion for capacity building and mentorship, he also founded IDEMU Mathematical Modeling Unit, Uganda, a research group that has so far trained 74 professionals from six African countries in infectious diseases modeling, a skill I felt was missing to enable infectious disease predictions across Africa. 

This initiative, earned him a position as a One Health High Level Expert Panel member at the World Health Organisation where he serves in his individual capacity as a consultant. He is currently a 3rd Year PhD Student at University of Cambridge, UK`,
    imageUrl: "/team/abel.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/abel-w-walekhwa-81b249a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      twitter: "https://x.com/abelwalekhwa?s=11",
      email: "wabelwilson@gmail.com",
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
  {
    id: "8",
    name: "Dr. Jean-Vincent LAMIEN,",
    position: "ACCM ambassador for West Africa",
    department: "Learning and Development",
    expertise: ["Public Health", "Health Policy", "Health Promotion"],
    about: `Dr Jean-Vincent LAMIEN is a medical doctor and public health professional from Burkina Faso. He is currently pursuing an MSc in Public Health with a focus on Health Systems and Disease Control at the prestigious Institute of Tropical Medicine in Antwerp, Belgium. Prior to his MSc studies, Dr LAMIEN worked as a clinical investigator at the Clinical Research Unit of Nanoro in Burkina Faso, where he participated in the clinical trial for the malaria vaccine R21/Matrix M. This vaccine was approved by the World Health Organisation in October 2023 for widespread use in endemic countries to combat clinical malaria in African children. He also spent nearly a year as the Malaria Advocacy Lead for Burkina Faso at the US non-governmental organisation 1Day Sooner, ensuring that all eligible children in Burkina Faso were immunised with the malaria vaccine.

Dr LAMIEN is an accomplished young leader who has participated in prestigious leadership programmes worldwide. In 2023, he took part in the Mandela Washington Fellowship as part of the US Young African Leaders Initiative (YALI) Programme, where he received training in Leadership in Public Management. As a way to give back to his community, he voluntarily provides coaching to young professionals for their career development.

Dr LAMIEN is passionate about health policy and governance, health system strengthening, health financing, the design and evaluation of health programmes, and global health. His career goal is to contribute to the strengthening of health systems in Africa through evidence-based policy decision-making.`,
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
