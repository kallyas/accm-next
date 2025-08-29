"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Search,
  MessageSquare,
  ArrowRight,
  ArrowDown,
  Briefcase,
  Award,
  ChevronRight,
  ScrollText,
  Zap,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { SubscribePlan } from "@/components/user/subscribe-plan";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import ServiceCard from "@/components/services/ServiceCard";

// Service categories with associated services
const serviceCategories = [
  {
    id: "career",
    name: "Career Development",
    description: "Personalized programs to advance your professional journey",
    icon: Briefcase,
    services: [
      {
        icon: Search,
        title: "Career Discovery & Planning",
        description: "Structured guidance to identify and pursue your ideal career path",
        features: [
          "Comprehensive career assessment and profiling",
          "Personalized career roadmap development",
          "Industry-specific guidance and insights",
          "Long-term career progression planning"
        ],
        color: "blue",
        image: "/services/career-planning.jpg"
      },
      {
        icon: Users,
        title: "Human Capital Development",
        description: "Comprehensive programs to build essential professional skills",
        features: [
          "Leadership and management skills training",
          "Change management and adaptability development",
          "Professional excellence and workplace competencies",
          "Team building and collaborative skills enhancement"
        ],
        color: "purple",
        image: "/services/leadership.jpg"
      },
      {
        icon: MessageSquare,
        title: "Interview Success Program",
        description: "Comprehensive preparation for confident, successful interviews",
        features: [
          "Personalized mock interview sessions with feedback",
          "Industry-specific question preparation",
          "Body language and presentation coaching",
          "Salary negotiation techniques"
        ],
        color: "green",
        image: "/services/interview.jpg"
      }
    ]
  },
  {
    id: "scholarship",
    name: "Scholarship & Academic",
    description: "Expert guidance for educational advancement opportunities",
    icon: GraduationCap,
    services: [
      {
        icon: GraduationCap,
        title: "International Scholarships Coaching",
        badge: "Most Popular",
        description: "Comprehensive guidance for winning international scholarships",
        features: [
          "Scholarship matching and opportunity identification",
          "Application strategy and timeline planning",
          "Personal statement and essay development",
          "Interview preparation and mock sessions"
        ],
        color: "amber",
        image: "/services/scholarship.jpg",
        packages: [
          {
            name: "Gold Package",
            duration: "6 months",
            features: [
              "Personal 1-on-1 mentoring",
              "Unlimited essay reviews",
              "Custom application strategy",
              "Interview preparation",
              "Weekly progress tracking"
            ]
          },
          {
            name: "Silver Package",
            duration: "3 months",
            features: [
              "Group mentoring sessions",
              "3 essay reviews",
              "General application guidance",
              "Basic interview tips",
              "Monthly progress check-ins"
            ]
          }
        ]
      },
      {
        icon: BookOpen,
        title: "Research & Academic Writing",
        description: "Develop essential research and scholarly writing skills",
        features: [
          "Research methodology and design training",
          "Academic writing and publishing guidance",
          "Literature review and analysis techniques",
          "Thesis and dissertation development support"
        ],
        color: "indigo",
        image: "/services/academic.jpg"
      }
    ]
  },
  {
    id: "documents",
    name: "Professional Documentation",
    description: "Expert assistance creating compelling professional documents",
    icon: ScrollText,
    services: [
      {
        icon: FileText,
        title: "Professional Document Preparation",
        description: "Create standout documents that showcase your professional value",
        features: [
          "Strategic CV/resume development and optimization",
          "Compelling personal statement creation",
          "Tailored cover letter development",
          "Professional portfolio organization"
        ],
        color: "cyan",
        image: "/services/documents.jpg"
      }
    ]
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "The scholarship coaching program was transformative. I successfully secured funding for my master's degree at a prestigious university.",
    name: "David O.",
    role: "Software Engineer",
    image: "/mentors/thumb.png"
  },
  {
    quote: "ACCM's CV alignment service completely transformed my job search. I started getting interviews immediately after the makeover.",
    name: "Sarah M.",
    role: "Marketing Professional",
    image: "/mentors/thumb.png"
  },
  {
    quote: "The mentorship program provided clear direction and actionable steps that helped me advance in my career within months.",
    name: "John D.",
    role: "Project Manager",
    image: "/mentors/thumb.png"
  }
];

export default function ClientServicesPage({ session }) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden rounded-2xl mb-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/80 z-10"></div>
          <Image 
            src="/accm/IMG_4681.JPG"
            alt="Career mentorship services"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-30 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transform Your Career Journey</h1>
            <p className="text-xl mb-8">
              Discover our comprehensive range of professional development services designed to help you build skills, gain confidence, and achieve your career goals.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                asChild
              >
                <a href="#services">
                  Explore Services
                  <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
              {!session && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl mb-16">
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, value: "10,000+", label: "Professionals Mentored" },
              { icon: Award, value: "98%", label: "Success Rate" },
              { icon: GraduationCap, value: "500+", label: "Scholarships Secured" },
              { icon: Briefcase, value: "75+", label: "Partner Organizations" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Main Services Section */}
      <section id="services" className="py-16 md:py-24">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Development Programs
            </h2>
            <p className="text-lg text-muted-foreground">
              Each program is carefully designed to provide you with the knowledge, skills, and confidence needed to excel in your professional life.
            </p>
          </motion.div>
          
          <Tabs defaultValue="career" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-blue-50 dark:bg-gray-800/50">
                {serviceCategories.map(category => (
                  <TabsTrigger 
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {serviceCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-8">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-muted-foreground max-w-2xl mx-auto mb-10"
                >
                  {category.description}
                </motion.p>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                  {category.services.map((service, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <ServiceCard 
                        service={service} 
                        color={service.color} 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden rounded-2xl mb-16">        
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground">
              Hear from professionals who have transformed their careers through our programs.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-blue-100 dark:border-blue-900/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                  <CardContent className="pt-6 pb-6 flex flex-col h-full">
                    <div className="mb-4 text-4xl text-blue-200 dark:text-blue-800">"</div>
                    <p className="italic text-gray-700 dark:text-gray-300 flex-grow">
                      {testimonial.quote}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Subscription Plans */}
      <section className="py-16 md:py-24">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
              Subscription Plans
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Learning Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Select a subscription plan that suits your needs and get access to our comprehensive learning programs.
            </p>
          </motion.div>
          
          <SubscribePlan />
          
          {!session && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mt-12"
            >
              <Link href="/login">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                  Start Learning Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* FAQ & Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
        <div>
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-4">Need Personal Assistance?</h3>
                <p className="text-muted-foreground mb-6">
                  Our team can help you find the perfect service or plan for your specific career needs.
                </p>
                <div className="space-y-4">
                  {[
                    { 
                      icon: Mail, 
                      title: "Email Us", 
                      detail: "admin@africanccm.com",
                      action: "Send Email",
                      link: "mailto:admin@africanccm.com"
                    },
                    { 
                      icon: Phone, 
                      title: "Call Us", 
                      detail: "+447 570 224 173",
                      action: "Call Now",
                      link: "tel:+447570224173"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{item.detail}</p>
                        <a 
                          href={item.link}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                        >
                          {item.action}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">Visit Contact Page</Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-teal-500 p-8 md:p-10 text-white flex items-center">
                <div>
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5" />
                    <h3 className="text-2xl font-bold">Fast Track Your Career</h3>
                  </div>
                  <p className="mb-6">
                    Schedule a free 15-minute consultation with our expert career advisors to discuss your career goals and how we can help you achieve them.
                  </p>
                  <Button 
                    className="bg-white text-blue-600 hover:bg-blue-50 w-full"
                    asChild
                  >
                    <Link href="/consultation">
                      Schedule Consultation
                      <Calendar className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}