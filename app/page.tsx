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
        {/* Enhanced Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
          {/* Subtle background with pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white to-gray-50/40 dark:from-gray-900/95 dark:via-gray-900 dark:to-gray-800/80"></div>
            <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23f3f4f6' fill-opacity='0.4'%3e%3ccircle cx='30' cy='30' r='1.5'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-6 space-y-8 lg:pr-8"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Africa's Premier Career Development Centre
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                    <span className="text-gray-900 dark:text-gray-100 block">
                      Transform Your
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 block">
                      Career Journey
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-xl font-light leading-relaxed">
                    Get personalized mentorship, expert guidance, and proven resources to accelerate your professional growth.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="group">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-2xl px-8 py-4 h-auto shadow-sm hover:shadow-lg transition-all duration-300 font-medium text-lg group-hover:scale-[1.02]"
                    >
                      Get Started Today
                      <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/about" className="group">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full sm:w-auto group border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 rounded-2xl px-8 py-4 h-auto transition-all duration-300 text-lg group-hover:scale-[1.02]"
                    >
                      <PlayCircle className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
                      Watch Our Story
                    </Button>
                  </Link>
                </div>

                {/* Enhanced Stats Row */}
                <div className="pt-8 flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300"
                        >
                          {i === 1 ? "AK" : i === 2 ? "MJ" : i === 3 ? "TL" : "5K+"}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">10,000+ Professionals</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Already transforming their careers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">4.9 (2.1k reviews)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-6"
              >
                {/* Enhanced Carousel with Cards */}
                <Carousel
                  ref={emblaRef}
                  opts={{ loop: true }}
                  plugins={[Autoplay({ delay: 4000 })]}
                  className="w-full relative"
                >
                  <CarouselContent className="-ml-4">
                    {carouselSlides.map((slide, index) => (
                      <CarouselItem key={index} className="pl-4">
                        <div className="relative group cursor-pointer">
                          <div className="relative h-[450px] lg:h-[520px] w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                            <Image
                              src={slide.image}
                              alt={slide.title}
                              fill
                              className="object-cover transition-all duration-700 group-hover:scale-105"
                              priority={index === 0}
                            />
                            {/* Modern overlay with better contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                            
                            {/* Content positioned better */}
                            <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-8">
                              {/* Top badge */}
                              <div className="flex justify-end">
                                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium">
                                  0{index + 1}
                                </div>
                              </div>

                              {/* Bottom content */}
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
                                    {slide.title}
                                  </h3>
                                  <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                                    {slide.description}
                                  </p>
                                </div>
                                <Link href={slide.ctaLink}>
                                  <Button className="bg-white hover:bg-gray-50 text-gray-900 rounded-2xl px-6 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    {slide.ctaText}
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Navigation buttons inside carousel */}
                  <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 h-12 w-12 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white shadow-lg border-0 hover:scale-105 transition-all duration-200" />
                  <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 h-12 w-12 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white shadow-lg border-0 hover:scale-105 transition-all duration-200" />
                  
                  {/* Custom carousel indicators */}
                  <div className="flex justify-center mt-6 gap-2">
                    {carouselSlides.map((_, index) => (
                      <button
                        key={index}
                        className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
                        onClick={() => emblaApi?.scrollTo(index)}
                      />
                    ))}
                  </div>
                </Carousel>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Minimalist */}
        <motion.section
          ref={featuresRef}
          variants={containerVariants}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          className="py-20 md:py-28 relative bg-white dark:bg-gray-900"
        >
          <div className="container mx-auto px-4">
            <motion.div
              variants={itemVariants}
              className="text-center max-w-2xl mx-auto mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Why Choose ACCM
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                The tools and guidance you need to excel in your career
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group text-center"
                >
                  <div className="mb-6 mx-auto w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 group-hover:scale-110 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Special Offers Section */}
        <SpecialOffersSection />

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
              <Link href="/mentors">
                <Button
                  variant="ghost"
                  className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-full px-8 py-3 h-auto transition-all duration-300"
                >
                  View All Mentors
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Success Stories - Subtle Design */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-950/30 dark:to-transparent" />
          </div>

          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Success Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                See how our community transforms careers
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
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
                      <div className="p-2 mt-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-8 py-3 h-auto shadow-sm hover:shadow-md transition-all duration-300 font-medium"
                    >
                      Join Now
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section - Minimalist */}
        <section ref={statsRef} className="py-24 px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Join 10,000+ professionals
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Transform your career with expert mentorship and proven resources
                </p>

                {/* Simple stats row */}
                <div className="flex flex-wrap justify-center gap-8 py-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {counters.students.toLocaleString()}+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Students helped
                    </div>
                  </div>
                  <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {counters.successRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Success rate
                    </div>
                  </div>
                  <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {counters.scholarships}+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Scholarships found
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-8 py-3 h-auto shadow-sm hover:shadow-md transition-all duration-300 font-medium"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-full px-8 py-3 h-auto transition-all duration-300"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Special Offers Section
function SpecialOffersSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const featuredOffers = [
    {
      title: "91.3% Success Rate",
      description: "Our proven track record with scholarship applications",
      image: "/offers/WhatsApp Image 2025-09-24 at 08.04.08 (3).jpeg",
      badge: "Success Stories",
      newOffer: true,
      gradient: "from-emerald-500 to-teal-600",
      link: "/offers"
    },
    {
      title: "Global Opportunities",
      description: "Scholarships in 13+ countries worldwide",
      image: "/offers/WhatsApp Image 2025-09-24 at 08.04.07.jpeg",
      badge: "International",
      newOffer: true,
      gradient: "from-blue-500 to-indigo-600",
      link: "/offers"
    },
    {
      title: "Professional Services",
      description: "Comprehensive career development packages",
      image: "/offers/WhatsApp Image 2025-09-24 at 08.04.08 (2).jpeg",
      badge: "Services",
      newOffer: false,
      gradient: "from-purple-500 to-pink-600",
      link: "/offers"
    }
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-800/30 dark:to-purple-800/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-r from-emerald-300 to-cyan-300 dark:from-emerald-800/30 dark:to-cyan-800/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-800/30 dark:to-orange-800/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Enhanced Section Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-800 dark:text-orange-200 text-sm font-semibold mb-8 shadow-lg border border-orange-200/50 dark:border-orange-700/50"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="uppercase tracking-wide">🔥 Limited Time Offers</span>
              <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold animate-pulse">
                NEW
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent leading-tight"
            >
              Exclusive Opportunities
              <br />
              <span className="text-3xl md:text-5xl">Await You</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              Discover our proven success stories and comprehensive services designed to accelerate your career journey to new heights
            </motion.p>
          </div>

          {/* Enhanced Featured Offers Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredOffers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                className="relative"
              >
                {/* Glowing border effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${offer.gradient} rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse`}></div>
                
                <Link href={offer.link} className="group block relative">
                  <div className="relative h-64 rounded-3xl overflow-hidden group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* NEW/OFFER Badge */}
                    {offer.newOffer && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-sm animate-pulse"></div>
                          <div className="relative px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg transform rotate-12 animate-bounce">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              NEW
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-4 py-2 bg-gradient-to-r ${offer.gradient} text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20`}>
                        {offer.badge}
                      </div>
                    </div>
                    
                    {/* Enhanced Overlay content */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-lg">
                        {offer.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
                        {offer.description}
                      </p>
                      <div className="mt-3 inline-flex items-center text-yellow-300 text-sm font-semibold group-hover:text-yellow-200 transition-colors">
                        <span>Learn More</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { value: "41", label: "Full Scholarships", icon: Trophy, color: "from-yellow-400 to-orange-500" },
              { value: "13", label: "Countries", icon: Globe, color: "from-blue-400 to-cyan-500" },
              { value: "91.3%", label: "Success Rate", icon: Star, color: "from-emerald-400 to-teal-500" },
              { value: "500+", label: "Students Helped", icon: Users, color: "from-purple-400 to-pink-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="relative group"
              >
                {/* Glowing effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}></div>
                <div className="relative text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group-hover:scale-105">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-3xl text-gray-900 dark:text-gray-100 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <div className="relative">
              {/* Glowing border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl p-10 md:p-16 text-white overflow-hidden shadow-2xl">
                {/* Enhanced Background decoration */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="mb-6"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Limited Time Only
                    </div>
                  </motion.div>
                  
                  <h3 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                    Don't Miss These 
                    <span className="block text-yellow-300">Exclusive Opportunities!</span>
                  </h3>
                  <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
                    Join thousands of professionals who have transformed their careers with our proven guidance and support. Your success story starts here!
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/offers">
                      <Button
                        size="lg"
                        className="bg-white hover:bg-gray-50 text-purple-600 rounded-full px-10 py-4 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border-2 border-white/50"
                      >
                        <Star className="w-6 h-6 mr-3 text-yellow-500" />
                        View All Offers
                        <ChevronRight className="w-6 h-6 ml-3" />
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-white text-white hover:bg-white hover:text-purple-600 rounded-full px-10 py-4 font-bold text-lg transition-all transform hover:scale-105 backdrop-blur-sm"
                      >
                        <Trophy className="w-6 h-6 mr-3" />
                        Get Started Today
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
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

          {/* CTA Button - Clean Design */}
          <div className="pt-6">
            <Link href="/scholarship-quest">
              <Button
                size="lg"
                className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-8 py-3 h-auto shadow-sm hover:shadow-md transition-all duration-300 font-medium"
              >
                Start Your Quest
                <GraduationCap className="w-5 h-5 ml-2" />
              </Button>
            </Link>
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
                className="text-center group p-6 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all"
              >
                <div className="font-bold text-3xl text-gray-900 dark:text-gray-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Our Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Comprehensive solutions for your professional growth
          </p>
        </div>

        <Tabs defaultValue="personalized-development" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
            {services.map((service) => (
              <TabsTrigger
                key={service.value}
                value={service.value}
                className="group transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-xl py-3"
              >
                <div className="flex items-center gap-2">
                  <service.icon className="h-5 w-5" />
                  <span className="font-medium">{service.title}</span>
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
                <Card className="border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                        <service.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
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
