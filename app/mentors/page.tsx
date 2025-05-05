"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Users,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  ChevronRight,
  Globe,
  Award,
  LinkedinIcon,
  TwitterIcon,
  MailIcon,
  CheckCircle
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const mentors = [
  {
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
      "Established partnerships with major corporations and educational institutions"
    ],
    education: [
      { degree: "Master's in Human Resource Development", institution: "Makerere University" },
      { degree: "Bachelor's in Education", institution: "Kyambogo University" }
    ],
    contact: {
      email: "abel@africanccm.com",
      linkedin: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally"
    }
  },
  {
    id: 2,
    name: "Birungi Evelyne",
    title: "Learning & Development Specialist",
    image: "/mentors/Picture2.png",
    expertise: [
      "Financial Literacy",
      "Trainer of Trainees",
      "HR-Learning and Development"
    ],
    bio: "Evelyne is a Learning and Development specialist currently serving as lead HR-Learning and Development at Wagagai Limited, one of the largest Horticulture farms in Uganda. She has a passion for financial literacy and has trained over 5000 employees in the last 10 years.",
    fullBio: "Birungi Evelyne has built her career around empowering others through education and skill development. As a Learning and Development specialist at Wagagai Limited, she has designed and implemented comprehensive training programs that address both technical skills and personal growth.\n\nEvelyne's expertise in financial literacy has been particularly transformative, helping employees at all levels make informed decisions about their financial futures. Her approach combines practical knowledge with actionable strategies, making complex financial concepts accessible to everyone.",
    achievements: [
      "Designed and implemented training programs for over 5,000 employees",
      "Developed a financial literacy curriculum adopted by multiple organizations",
      "Increased employee retention by 35% through targeted development programs",
      "Recipient of the HR Excellence Award for Training Innovation"
    ],
    education: [
      { degree: "Master's in Human Resource Management", institution: "Uganda Management Institute" },
      { degree: "Bachelor's in Business Administration", institution: "Makerere University Business School" }
    ],
    contact: {
      email: "evelyne@africanccm.com",
      linkedin: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally"
    }
  },
  {
    id: 3,
    name: "Harriet Ocitti",
    title: "Communication Coach",
    image: "/mentors/harriet.jpg",
    expertise: [
      "Public Speaking",
      "Leadership Skills",
      "Communication Coaching"
    ],
    bio: "Harriet Ocitti serves as the Executive Director at the Institute for National Transformation (INT), whose mission is to develop no-excuse leaders who will transform their spheres of influence to greater levels of performance and excellence. She brings a wealth of experience in communication and leadership coaching.",
    fullBio: "Harriet Ocitti is a distinguished communication professional who believes in the transformative power of effective communication in leadership. As the Executive Director at the Institute for National Transformation, she works to cultivate leaders who can drive positive change through clear vision and powerful communication.\n\nWith her background in both business and education, Harriet brings a unique perspective to her coaching practice. Her holistic approach addresses not only the technical aspects of communication but also the emotional intelligence and presence that make leaders truly impactful.",
    achievements: [
      "Coached executives from over 50 organizations across East Africa",
      "Developed the 'Communicate to Lead' framework for effective leadership communication",
      "Featured speaker at international leadership conferences",
      "Published author on communication strategies for emerging leaders"
    ],
    education: [
      { degree: "Master's in Communication Studies", institution: "University of Nairobi" },
      { degree: "Bachelor's in Business Communication", institution: "Makerere University" }
    ],
    contact: {
      email: "harriet@africanccm.com",
      linkedin: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/",
      twitter: "https://x.com/mentorglobally"
    }
  },
];

export default function MentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState(null);
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
    },
  };

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="relative mb-16 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90 z-10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 z-20 py-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Expert Mentors & Team</h1>
            <p className="text-xl">
              Meet our experienced professionals dedicated to guiding you through your career journey and helping you unlock your full potential.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm text-white/80">Years Experience</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-sm text-white/80">Professionals Mentored</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm text-white/80">African Countries</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Introduction */}
        <section className="mb-16 max-w-3xl">
          <h2 className="text-3xl font-bold mb-4 text-gradient-primary">Meet Our Leadership Team</h2>
          <p className="text-lg text-muted-foreground">
            Our mentors bring diverse expertise across multiple industries and specialties. 
            Each mentor is carefully selected for their experience, passion for development, 
            and commitment to helping others achieve their professional goals.
          </p>
        </section>
        
        {/* Mentor Cards */}
        <motion.section
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-20"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor, index) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                index={index}
                onSelect={() => setSelectedMentor(mentor)}
              />
            ))}
          </div>
        </motion.section>
        
        {/* Mentorship Approach */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900/30">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-6 text-gradient-primary">Our Mentorship Approach</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that effective mentorship should be personalized, actionable, and focused on long-term growth. 
                  Our comprehensive methodology ensures that you receive guidance tailored to your specific career goals.
                </p>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "Personalized Assessment",
                      description: "We start by understanding your unique strengths, challenges, and career aspirations."
                    },
                    {
                      title: "Structured Development Plan",
                      description: "Create a clear roadmap with actionable steps toward your professional goals."
                    },
                    {
                      title: "Regular Guidance Sessions",
                      description: "Ongoing support and accountability to ensure continuous progress."
                    },
                    {
                      title: "Network Building",
                      description: "Connect with industry professionals and like-minded peers."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="mt-8 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                  Learn About Our Process
                </Button>
              </div>
              
              <div className="relative lg:h-full h-64">
                <Image
                  src="/accm/IMG_4713.JPG"
                  alt="Mentorship session"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-500/20"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="relative rounded-xl overflow-hidden mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90 z-10" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay"></div>
          <div className="relative container mx-auto z-20 py-16 px-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join thousands of professionals who have transformed their careers through our mentorship programs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Find Your Mentor
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Programs
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      {/* Mentor Detail Modal */}
      {selectedMentor && (
        <Dialog open={!!selectedMentor} onOpenChange={() => setSelectedMentor(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mentor Profile</DialogTitle>
              <DialogDescription>Learn more about your potential mentor</DialogDescription>
            </DialogHeader>
            
            <MentorDetail mentor={selectedMentor} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Mentor Card Component
function MentorCard({ mentor, index, onSelect }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay: index * 0.1 }
        }
      }}
      className="h-full"
    >
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg group border-blue-100 dark:border-blue-900/50 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-teal-500 w-full"></div>
        <CardHeader className="relative pb-0">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-white dark:border-gray-800">
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            
            <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {mentor.name}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {mentor.title}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-2 flex-grow">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.expertise.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-4">
              {mentor.bio}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2">
          <Button 
            onClick={onSelect} 
            variant="outline" 
            className="w-full border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          >
            <span>View Profile</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Mentor Detail Component
function MentorDetail({ mentor }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative w-32 h-32 flex-shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full blur-sm opacity-70"></div>
          <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white dark:border-gray-800">
            <Image
              src={mentor.image}
              alt={mentor.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">{mentor.name}</h2>
          <p className="text-muted-foreground">{mentor.title}</p>
          
          <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
            {mentor.expertise.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {skill}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-3 mt-4 justify-center sm:justify-start">
            <a 
              href={mentor.contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a 
              href={mentor.contact.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
              aria-label="Twitter profile"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a 
              href={`mailto:${mentor.contact.email}`}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
              aria-label="Email contact"
            >
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="bio" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="bio">Biography</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bio" className="space-y-4">
          <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <p className="whitespace-pre-line text-muted-foreground">
              {mentor.fullBio}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-lg font-medium mb-4 text-blue-600 dark:text-blue-400">Key Achievements</h3>
            <ul className="space-y-3">
              {mentor.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <span className="text-muted-foreground">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="space-y-4">
          <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-lg font-medium mb-4 text-blue-600 dark:text-blue-400">Education & Qualifications</h3>
            <div className="space-y-4">
              {mentor.education.map((edu, index) => (
                <div key={index} className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
          Request Mentorship
        </Button>
      </div>
    </div>
  );
}