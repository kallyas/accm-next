"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Award,
  BookMarked,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  ChevronRight,
  Code,
  Globe,
  GraduationCap,
  Laptop,
  Library,
  LineChart,
  Network,
  PlayCircle,
  Presentation,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

// Import the components we're using
import { TestimonialSlider } from "@/components/testimonial-slider";
import { FeaturedMentors } from "@/components/featured-mentors";

const carouselSlides = [
  {
    image: "/accm/IMG_4666.JPG",
    title: "Empowering Careers, Inspiring Futures",
    description: "Join our mentorship program and unlock your full potential",
    ctaText: "Get Started",
    ctaLink: "/register",
  },
  {
    image: "/accm/IMG_4681.JPG",
    title: "Learn from Industry Experts",
    description: "Connect with experienced professionals in your field",
    ctaText: "Find a Mentor",
    ctaLink: "/mentors",
  },
  {
    image: "/accm/IMG_4710.JPG",
    title: "Advance Your Skills",
    description: "Access our comprehensive resources and workshops",
    ctaText: "Explore Resources",
    ctaLink: "/resources",
  },
  {
    image: "/accm/IMG_4713.JPG",
    title: "Scholarship Quest",
    description: "Discover your scholarship potential with our quest",
    ctaText: "Start Your Quest",
    ctaLink: "/scholarship-quest",
  },
];

const features = [
  {
    icon: <GraduationCap className="h-10 w-10" />,
    title: "Expert Mentorship",
    description: "Learn from industry professionals with years of experience",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Community Support",
    description: "Join a thriving community of like-minded professionals",
  },
  {
    icon: <Target className="h-10 w-10" />,
    title: "Career Growth",
    description: "Achieve your career goals with personalized guidance",
  },
  {
    icon: <Award className="h-10 w-10" />,
    title: "Skill Development",
    description: "Enhance your skills through workshops and resources",
  },
];

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  // Stats counter animation
  const [counters, setCounters] = useState({
    students: 0,
    successRate: 0,
    scholarships: 0,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  // Hero section animation
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Features section animation
  const [featuresRef, featuresInView] = useInView({
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

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        // Optional: Update state or perform actions on slide change
      });
    }

    // Animate stats when in view
    if (statsInView) {
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);

      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        setCounters({
          students: Math.floor(progress * 10000),
          successRate: Math.floor(progress * 85),
          scholarships: Math.floor(progress * 500),
        });

        if (frame === totalFrames) {
          clearInterval(timer);
        }
      }, frameDuration);

      return () => clearInterval(timer);
    }
  }, [emblaApi, statsInView]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-grow">
        {/* Hero Section */}
        <section ref={heroRef} className="relative">
          <AnimatePresence>
            {heroInView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent"
              >
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300/30 dark:bg-blue-700/20 rounded-full blur-3xl" />
                    <div className="absolute top-60 -right-20 w-60 h-60 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 left-20 w-80 h-80 bg-teal-300/20 dark:bg-teal-700/10 rounded-full blur-3xl" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="container mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium">
                  Africa's Premier Career Development Centre
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-gray-900 dark:text-gray-100">
                    Build Your{" "}
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                    Dream Career
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                  African Centre For Career Mentorship provides expert guidance
                  and resources to help you navigate your professional journey
                  with confidence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/register" className="flex items-center gap-2">
                      Get Started
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <Link href="/about" className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                      Watch Our Story
                    </Link>
                  </Button>
                </div>
                <div className="pt-6 flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 p-0.5"
                      >
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Trusted by{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-200">
                      10,000+
                    </span>{" "}
                    professionals
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur opacity-30 dark:opacity-40 animate-pulse"></div>
                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                  <Carousel
                    ref={emblaRef}
                    opts={{ loop: true }}
                    plugins={[Autoplay({ delay: 5000 })]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {carouselSlides.map((slide, index) => (
                        <CarouselItem key={index}>
                          <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl">
                            <Image
                              src={slide.image}
                              alt={slide.title}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                              priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 flex flex-col justify-end p-8">
                              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {slide.title}
                              </h3>
                              <p className="text-white/90 mb-4">
                                {slide.description}
                              </p>
                              <Button
                                asChild
                                className="w-fit bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                              >
                                <Link href={slide.ctaLink}>
                                  {slide.ctaText}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                      <CarouselPrevious className="h-8 w-8 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50" />
                      <CarouselNext className="h-8 w-8 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50" />
                    </div>
                  </Carousel>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section
          ref={featuresRef}
          variants={containerVariants}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          className="py-20 md:py-28 relative"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent" />
          </div>

          <div className="container mx-auto px-4">
            <motion.div
              variants={itemVariants}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Empowering Your Professional Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                At African Centre For Career Mentorship, we provide the
                guidance, tools, and community you need to excel in your career
                path.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative p-8 rounded-xl backdrop-blur-sm border border-blue-100 dark:border-blue-800/50 
                    bg-white/60 dark:bg-gray-900/60 hover:bg-white/90 dark:hover:bg-gray-900/90 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-teal-500/20 rounded-xl blur opacity-0 
                    group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative flex flex-col h-full">
                    <div className="mb-6 p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl w-fit text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Scholarship Quest Section */}
        <ScholarshipHeroSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Mentors Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:from-transparent dark:via-blue-950/10 dark:to-transparent" />
            <div className="absolute -top-40 right-0 w-80 h-80 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-80 h-80 bg-teal-300/20 dark:bg-teal-700/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                Expert Guidance
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Learn From Our Featured Mentors
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Connect with experienced professionals who are dedicated to
                helping you achieve your career goals.
              </p>
            </div>

            <FeaturedMentors />

            <div className="mt-12 text-center">
              <Button
                asChild
                variant="outline"
                className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                <Link href="/mentors" className="flex items-center gap-2">
                  View All Mentors
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent dark:from-blue-950/10 dark:to-transparent" />
            <div className="absolute top-40 left-0 w-80 h-80 bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 right-20 w-80 h-80 bg-teal-300/20 dark:bg-teal-700/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium mb-4">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Hear From Our Community
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Discover how our mentorship and resources have transformed
                careers and opened new opportunities.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <TestimonialSlider />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent" />
          </div>

          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur opacity-30 dark:opacity-40"></div>
                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src="/accm/IMG_4710.JPG"
                    alt="Community event"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-medium">
                  Join Our Community
                </span>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Grow Together, Succeed Together
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Become part of a thriving community of professionals dedicated
                  to growth and success. Network with peers, share experiences,
                  and collaborate on projects that advance your career.
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      icon: Users,
                      text: "Connect with like-minded professionals",
                    },
                    {
                      icon: Presentation,
                      text: "Access exclusive workshops and events",
                    },
                    {
                      icon: Globe,
                      text: "Join our global network spanning Africa",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="p-1 mt-1 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/register">Join Now</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={statsRef} className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-teal-500/5 dark:from-blue-800/10 dark:to-teal-700/10" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5" />
          </div>

          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="space-y-8 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium">
                  Our Impact
                </span>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Making a Difference Across Africa
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                  <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {counters.students.toLocaleString()}+
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      Students Helped
                    </div>
                  </div>
                  <div className="p-6 rounded-xl bg-teal-50/50 dark:bg-teal-900/20">
                    <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                      {counters.successRate}%
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      Success Rate
                    </div>
                  </div>
                  <div className="p-6 rounded-xl bg-purple-50/50 dark:bg-purple-900/20">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {counters.scholarships}+
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      Scholarships Found
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">
                    Ready to Take the Next Step?
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Start your journey towards career success with African
                    Centre For Career Mentorship today. Our expert mentors and
                    resources are ready to help you achieve your goals.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <Link href="/register">Get Started</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-blue-200 dark:border-blue-800"
                    >
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Scholarship Hero Section
function ScholarshipHeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/80 to-transparent dark:from-transparent dark:via-blue-950/20 dark:to-transparent" />
      </div>

      {/* Floating icons */}
      <AnimatePresence>
        {inView && (
          <>
            <FloatingIcon className="top-12 left-1/4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <GraduationCap className="w-8 h-8 text-blue-500" />
              </motion.div>
            </FloatingIcon>
            <FloatingIcon className="top-32 right-1/4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Star className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </FloatingIcon>
            <FloatingIcon className="bottom-20 left-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <BookOpen className="w-8 h-8 text-teal-500" />
              </motion.div>
            </FloatingIcon>
            <FloatingIcon className="top-40 right-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <Trophy className="w-8 h-8 text-amber-500" />
              </motion.div>
            </FloatingIcon>
            <FloatingIcon className="bottom-32 right-1/4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <Sparkles className="w-6 h-6 text-purple-500" />
              </motion.div>
            </FloatingIcon>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          {/* Glowing heading */}
          <div className="relative inline-block mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg blur-xl opacity-30 animate-pulse" />
            <h2 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Discover Your Scholarship Potential
            </h2>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Embark on an exciting quest to assess your eligibility for
            scholarships and unlock your academic future! Join thousands of
            students who've already discovered their opportunities.
          </p>

          {/* CTA Button with animation */}
          <div className="relative inline-block group pt-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200" />
            <Button
              asChild
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link
                href="/scholarship-quest"
                className="flex items-center gap-2"
              >
                Start Your Quest
                <GraduationCap className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Stats with animation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            {[
              { label: "Students Helped", value: "10,000+" },
              { label: "Success Rate", value: "85%" },
              { label: "Scholarships Found", value: "500+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="text-center group p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 hover:shadow-lg transition-all"
              >
                <div className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// Services Section
const ServicesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      value: "personalized-development",
      title: "Mentorship",
      description: "Tailored guidance and strategic career support",
      icon: Users,
      bgClass:
        "from-blue-600/90 to-purple-600/90 dark:from-blue-500/30 dark:to-purple-500/30",
      accentClass: "text-blue-600 dark:text-blue-400",
      highlight: "Personalized Growth",
      details: {
        overview:
          "A comprehensive approach to professional growth combining one-on-one mentorship, executive coaching, and personalized career strategies.",
        keyFeatures: [
          {
            text: "Individual career mapping",
            icon: LineChart,
          },
          {
            text: "Personalized mentorship programs",
            icon: GraduationCap,
          },
          {
            text: "Executive-level strategic guidance",
            icon: Building2,
          },
          {
            text: "Targeted professional development",
            icon: Target,
          },
        ],
        serviceComponents: [
          {
            name: "One-on-One Mentorship",
            icon: UserPlus,
            bgClass:
              "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20",
            focus: [
              {
                text: "Career path alignment",
                icon: LineChart,
              },
              {
                text: "Skill gap analysis",
                icon: Target,
              },
              {
                text: "Personal branding",
                icon: Star,
              },
              {
                text: "Professional confidence building",
                icon: Award,
              },
            ],
          },
          {
            name: "Executive Coaching",
            icon: Zap,
            bgClass:
              "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20",
            focus: [
              {
                text: "Leadership development",
                icon: Users,
              },
              {
                text: "Strategic career positioning",
                icon: Target,
              },
              {
                text: "High-performance mindset",
                icon: Brain,
              },
              {
                text: "Organizational influence",
                icon: Building2,
              },
            ],
          },
        ],
        idealFor: [
          {
            text: "Early to mid-career professionals",
            icon: Briefcase,
          },
          {
            text: "Emerging leaders",
            icon: Star,
          },
          {
            text: "Career transition specialists",
            icon: UserPlus,
          },
          {
            text: "Individuals seeking strategic career growth",
            icon: LineChart,
          },
        ],
      },
    },
    {
      value: "skill-enhancement",
      title: "Workshops",
      description: "Comprehensive skill development programs",
      icon: Rocket,
      bgClass: "from-orange-600 to-pink-600",
      accentClass: "text-blue-600 dark:text-blue-400",
      highlight: "Accelerated Learning",
      details: {
        overview:
          "Immersive learning experiences designed to build critical professional skills through workshops, technology training, and interactive learning.",
        keyFeatures: [
          {
            text: "Interactive skill-building workshops",
            icon: Presentation,
          },
          {
            text: "Technology career acceleration",
            icon: Rocket,
          },
          {
            text: "Practical learning methodologies",
            icon: Brain,
          },
          {
            text: "Industry-relevant skill development",
            icon: Briefcase,
          },
        ],
        serviceComponents: [
          {
            name: "Career Development Workshops",
            icon: Presentation,
            bgClass:
              "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20",
            focus: [
              {
                text: "Leadership skills",
                icon: Users,
              },
              {
                text: "Communication techniques",
                icon: Presentation,
              },
              {
                text: "Negotiation strategies",
                icon: Target,
              },
              {
                text: "Problem-solving methodologies",
                icon: Brain,
              },
            ],
          },
          {
            name: "Tech Career Acceleration",
            icon: Laptop,
            bgClass:
              "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20",
            focus: [
              {
                text: "Cutting-edge tech skills",
                icon: Code,
              },
              {
                text: "AI and machine learning",
                icon: Brain,
              },
              {
                text: "Cloud computing",
                icon: Globe,
              },
              {
                text: "Cybersecurity insights",
                icon: Shield,
              },
            ],
          },
        ],
        idealFor: [
          {
            text: "Professionals seeking skill upgradation",
            icon: Rocket,
          },
          {
            text: "Technology enthusiasts",
            icon: Laptop,
          },
          {
            text: "Team leaders and managers",
            icon: Users,
          },
          {
            text: "Individuals in dynamic industries",
            icon: LineChart,
          },
        ],
      },
    },
    {
      value: "learning-resources",
      title: "Resources",
      description:
        "Comprehensive learning and professional connection platforms",
      icon: BookOpen,
      bgClass: "from-green-600 to-teal-600",
      accentClass: "text-blue-600 dark:text-blue-400",
      highlight: "Continuous Learning",
      details: {
        overview:
          "A holistic approach to professional development through extensive resources, flexible learning platforms, and strategic networking opportunities.",
        keyFeatures: [
          {
            text: "Extensive digital learning library",
            icon: Library,
          },
          {
            text: "Multi-format educational content",
            icon: BookMarked,
          },
          {
            text: "Professional networking platforms",
            icon: Network,
          },
          {
            text: "Continuous learning ecosystem",
            icon: Globe,
          },
        ],
        serviceComponents: [
          {
            name: "Career Resources Library",
            icon: Library,
            bgClass:
              "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20",
            focus: [
              {
                text: "E-books and guides",
                icon: BookOpen,
              },
              {
                text: "Video masterclasses",
                icon: Presentation,
              },
              {
                text: "Industry insights",
                icon: LineChart,
              },
              {
                text: "Self-paced learning",
                icon: Target,
              },
            ],
          },
          {
            name: "Professional Networking",
            icon: Network,
            bgClass:
              "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20",
            focus: [
              {
                text: "Virtual networking events",
                icon: Globe,
              },
              {
                text: "Industry conferences",
                icon: Users,
              },
              {
                text: "Professional community circles",
                icon: Network,
              },
              {
                text: "Strategic connection building",
                icon: UserPlus,
              },
            ],
          },
        ],
        idealFor: [
          {
            text: "Self-motivated learners",
            icon: Brain,
          },
          {
            text: "Professionals expanding their network",
            icon: Network,
          },
          {
            text: "Job seekers",
            icon: Briefcase,
          },
          {
            text: "Individuals seeking flexible learning",
            icon: BookOpen,
          },
        ],
      },
    },
  ];

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:from-transparent dark:via-blue-950/10 dark:to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300/10 dark:bg-blue-700/10 rounded-full blur-3xl" />
          <div className="absolute top-60 -right-20 w-60 h-60 bg-purple-300/10 dark:bg-purple-700/5 rounded-full blur-3xl" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="mt-4 max-w-2xl mx-auto">
            <p className="text-gray-600 dark:text-gray-300">
              Discover our comprehensive suite of services designed to
              accelerate your professional growth
            </p>
          </div>
        </div>

        <Tabs defaultValue="personalized-development" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-1.5">
            {services.map((service) => (
              <TabsTrigger
                key={service.value}
                value={service.value}
                className="group transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[state=active]:bg-blue-100/80 dark:data-[state=active]:bg-blue-800/30 rounded-md"
              >
                <div className="flex items-center gap-2 py-2">
                  <service.icon className="h-5 w-5" />
                  <span>{service.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {services.map((service) => (
            <TabsContent
              key={service.value}
              value={service.value}
              className="space-y-8"
            >
              <AnimatedCard>
                <Card className="border border-blue-100 dark:border-blue-900/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg bg-gradient-to-r",
                          service.bgClass
                        )}
                      >
                        <service.icon className="h-6 w-6 text-white dark:text-white/90" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Overview Section */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-3">
                            Overview
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {service.details.overview}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-4">
                            Key Features
                          </h4>
                          <ul className="space-y-3">
                            {service.details.keyFeatures?.map(
                              (feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 group"
                                >
                                  <feature.icon
                                    className={cn(
                                      "h-5 w-5 mt-1 flex-shrink-0 transition-colors",
                                      service.accentClass
                                    )}
                                  />
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {feature.text}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Service Components */}
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg">
                            Service Components
                          </h4>
                          {service.details.serviceComponents?.map(
                            (component, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "p-4 rounded-lg transition-all",
                                  "bg-gradient-to-r",
                                  component.bgClass,
                                  "hover:shadow-md dark:hover:shadow-none hover:scale-[1.02]"
                                )}
                              >
                                <h5
                                  className={cn(
                                    "font-semibold mb-2 flex items-center gap-2",
                                    service.accentClass
                                  )}
                                >
                                  <component.icon className="h-5 w-5" />
                                  {component.name}
                                </h5>
                                <ul className="space-y-2">
                                  {component.focus.map((item, itemIdx) => (
                                    <li
                                      key={itemIdx}
                                      className="flex items-center gap-2"
                                    >
                                      <div
                                        className={cn(
                                          "h-1.5 w-1.5 rounded-full",
                                          service.accentClass,
                                          "bg-current"
                                        )}
                                      />
                                      <span className="text-gray-600 dark:text-gray-300">
                                        {item.text}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </section>
  );
};

// Helper Components
const AnimatedCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={cn("relative group", className)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-teal-600/30 dark:from-blue-600/20 dark:to-teal-600/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient" />
      {children}
    </motion.div>
  );
};

const FloatingIcon = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`absolute animate-float opacity-80 ${className}`}>
    {children}
  </div>
);
