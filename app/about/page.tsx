"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Users,
  Target,
  Lightbulb,
  Award,
  Star,
  Handshake,
  Clock,
  BookOpen,
  Building,
  HeartHandshake,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      {/* Hero Section */}
      <section className="relative mb-16 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/80 z-10" />
        <Image
          src="/accm/IMG_4727.JPG"
          alt="African Centre For Career Mentorship Team"
          width={1200}
          height={500}
          className="object-cover w-full h-[300px] md:h-[400px]"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center p-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            About African Centre For Career Mentorship
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl"
          >
            A sustainable center of excellence for career mentorship and human capital development in Africa
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div>
        {/* Our Story Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl blur opacity-20"></div>
                <Image
                  src="/accm/IMG_4727.JPG"
                  alt="Team at African Centre For Career Mentorship"
                  width={600}
                  height={400}
                  className="rounded-lg relative shadow-xl"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 text-gradient-primary">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  African Centre For Career Mentorship is a sustainable center of excellence dedicated to empowering professionals across Africa through expert guidance and innovative career development programs.
                </p>
                <p className="text-lg">
                  Founded by Abel Wilson Walekhwa, our mission is to bridge the gap between education and industry needs, fostering a new generation of skilled and confident professionals ready to take on the challenges of the modern workplace.
                </p>
                <p className="text-lg">
                  Through our unique 4WFramework and personalized mentorship approach, we've helped thousands of individuals unlock their potential and achieve their career goals.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild className="bg-gradient-primary hover:from-blue-700 hover:to-teal-600 text-white">
                  <Link href="/contact">Connect With Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Vision, Mission, Goal Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-blue-100 dark:border-blue-900/50">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl text-gradient-primary">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    A sustainable centre of excellence for Career Mentorship and Human Capital Development in Africa.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-teal-100 dark:border-teal-900/50">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle className="text-2xl text-gradient-primary">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    To set up a functional and Sustainable Centre of Excellence for Career Mentorship and Human Capital Development in Uganda by December 2025.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-purple-100 dark:border-purple-900/50">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl text-gradient-primary">Our Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    To equip youths and professionals with growing and changing job market skills and support them their full potentials for socio-economic transformation of Africa.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-gradient-primary">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide our approach to empowering professionals and transforming careers across Africa.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Award, title: "Professionalism", description: "We maintain the highest standards of professional conduct in all our interactions." },
              { icon: Book, title: "Research", description: "We base our approaches on thorough research and evidence-based practices." },
              { icon: Star, title: "Excellence", description: "We strive for excellence in all our programs and services." },
              { icon: Handshake, title: "Collaboration", description: "We believe in the power of working together to achieve greater impact." },
            ].map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border-blue-100/50 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <value.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Objectives Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-gradient-primary">Specific Objectives</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our strategic roadmap to create lasting impact in career development across Africa.
            </p>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-blue-100 dark:border-blue-900/30 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  icon: Building,
                  title: "Sustainable Organization",
                  description: "To grow a sustainable and accountable organization by December 2025.",
                  deadline: "December 2025"
                },
                {
                  icon: Users,
                  title: "Human Capital Development",
                  description: "To design and implement professional Human Capital Development program for over 300 staff from 10 different organizations by December 2024.",
                  deadline: "December 2024"
                },
                {
                  icon: BookOpen,
                  title: "Career Mentorship Curriculum",
                  description: "To develop a two-career mentorship curricular for Science, Technology, Engineering and Mathematics and Humanities students leaving universities and colleges in Uganda by June 2024.",
                  deadline: "June 2024"
                },
                {
                  icon: Building,
                  title: "Mentorship Centre",
                  description: "To set up one carrier mentorship Centre For both STEM and Humanities students leaving universities and colleges in Uganda by December 2023.",
                  deadline: "December 2023"
                },
                {
                  icon: Users,
                  title: "Career Services Initiation",
                  description: "To initiate a career mentorship services for both STEM and Humanities students from Kampala metropolitan area from 0 to 2M by December 2024.",
                  deadline: "December 2024"
                },
                {
                  icon: Users,
                  title: "Career Services Advancement",
                  description: "To advance Career services for 1M students in 10 academic institutions and universities in Kampala metropolitan area by December 2025.",
                  deadline: "December 2025"
                },
              ].map((objective, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 flex items-center justify-center">
                        <objective.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{objective.title}</h3>
                      <p className="text-muted-foreground mb-2">{objective.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Target: {objective.deadline}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Impact Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-gradient-primary">Our Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results through dedication to transformative leadership and career development.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-blue-100 dark:border-blue-900/50 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400 w-full"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">Previous Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      "Conducted a Leadership and Change Management training at Give Directly, Uganda, December 2023",
                      "Excellence at work, Career Visualization and Conflicts resolution at African Youth Action Network, July, 2023 and January 2024",
                      "International Coaching for professionals with success rate of 98.1% admission stage and scholarship at 82.7% for 2023-24",
                      "Youth empowered leadership and entrepreneurship inaugural project, July-September 2023",
                    ].map((impact, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground">{impact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-teal-100 dark:border-teal-900/50 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-teal-600 to-teal-400 w-full"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <HeartHandshake className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle className="text-2xl">Community Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      "Contributed to education services access through Nalusaga Young Persons Savings and Cooperative Society LTD, Himutu Subcounty, Butaleja District (REG NO P9392/RCS) (USD 4,174)",
                      "Supported girl child school retention project at Butaleja Technical Institute, 2023 (USD 55.5)",
                    ].map((service, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground">{service}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90 z-10" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay"></div>
            <div className="relative z-20 py-16 px-6 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                Join thousands of professionals who have accelerated their careers through our mentorship programs.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/services">Explore Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}