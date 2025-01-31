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
import { TestimonialSlider } from "@/components/testimonial-slider";
import { FeaturedMentors } from "@/components/featured-mentors";
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
  Code,
  Globe,
  GraduationCap,
  Laptop,
  Library,
  LineChart,
  Network,
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
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

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
  }
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        // Optional: Update some state or perform actions on slide change
      });
    }
  }, [emblaApi]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Carousel
          ref={emblaRef}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full rounded-lg mt-8"
        >
          <CarouselContent className="rounded-lg">
            {carouselSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[60vh] w-full rounded-lg">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                      <p className="text-xl mb-6">{slide.description}</p>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                      >
                        <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <motion.section
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-center mb-12"
            >
              Why Choose African Centre For Career Mentorship?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center p-6 rounded-xl backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-4 text-primary">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        <ScholarshipHeroSection />

        <ServicesSection />

        <section className="py-20 px-20 bg-secondary rounded-lg">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Mentors
            </h2>
            <FeaturedMentors />
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Success Stories
            </h2>
            <TestimonialSlider />
          </div>
        </section>

        <section className="py-20 px-20 bg-secondary rounded-lg">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Join Our Community
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Image
                  src="/accm/IMG_4710.JPG"
                  alt="Community event"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <p className="text-lg">
                  Become part of a thriving community of professionals dedicated
                  to growth and success. Network with peers, share experiences,
                  and collaborate on projects.
                </p>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                  >
                    Join Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl mb-8">
              Start your journey towards career success with African Centre For
              Career Mentorship today.
            </p>
            <div className="space-x-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const ServicesSection = () => {
  const services = [
    {
      value: "personalized-development",
      title: "Mentorship",
      description: "Tailored guidance and strategic career support",
      icon: Users,
      bgClass: "from-blue-600/90 to-purple-600/90 dark:from-blue-500/30 dark:to-purple-500/30",
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
            bgClass: "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20",
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
            bgClass: "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20",
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
            bgClass: "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20",
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
            bgClass: "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20",
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
            bgClass: "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20",
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
            bgClass: "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20",
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
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full -top-10 -left-16 blur-3xl animate-pulse" />
          <div className="absolute w-96 h-96 bg-secondary/5 dark:bg-secondary/10 rounded-full -bottom-10 -right-16 blur-3xl animate-pulse delay-700" />
        </div>
      </div>

      <div className="container mx-auto relative">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            What We Offer
          </span>
          <h2 className="text-4xl font-bold mt-2 bg-gradient-to-r from-primary to-primary/60 dark:from-primary/90 dark:to-primary/50 bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="mt-4 max-w-2xl mx-auto">
            <p className="text-muted-foreground">
              Discover our comprehensive suite of services designed to
              accelerate your professional growth
            </p>
          </div>
        </div>

        <Tabs defaultValue="personalized-development" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-background dark:bg-background/95">
            {services.map((service) => (
              <TabsTrigger
                key={service.value}
                value={service.value}
                className="group transition-all duration-300 hover:bg-primary/5 dark:hover:bg-primary/10 data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20"
              >
                <div className="flex items-center gap-2">
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
                <Card className="border border-border dark:border-border/50 bg-card dark:bg-card/95 backdrop-blur-sm">
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
                          <p className="text-muted-foreground leading-relaxed">
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
                                  <span className="text-muted-foreground">
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
                                  "p-4 rounded-lg transition-colors",
                                  "bg-gradient-to-r",
                                  component.bgClass,
                                  "hover:shadow-md dark:hover:shadow-none"
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
                                      <span className="text-muted-foreground">
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
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </section>
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

function ScholarshipHeroSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute w-96 h-96 bg-blue-400/10 rounded-full -top-10 -left-16 blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 bg-teal-400/10 rounded-full -bottom-10 -right-16 blur-3xl animate-pulse delay-700" />
      </div>

      {/* Floating icons */}
      <FloatingIcon className="top-12 left-1/4">
        <GraduationCap className="w-8 h-8 text-blue-500 animate-spin-slow" />
      </FloatingIcon>
      <FloatingIcon className="top-32 right-1/4">
        <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
      </FloatingIcon>
      <FloatingIcon className="bottom-20 left-1/3">
        <BookOpen className="w-8 h-8 text-teal-500 animate-bounce" />
      </FloatingIcon>
      <FloatingIcon className="top-40 right-1/3">
        <Trophy className="w-8 h-8 text-amber-500 animate-float" />
      </FloatingIcon>
      <FloatingIcon className="bottom-32 right-1/4">
        <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
      </FloatingIcon>

      <div className="container relative mx-auto text-center px-4">
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Main content */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 blur-2xl opacity-20 animate-pulse" />
            <h2 className="relative text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Discover Your Scholarship Potential
            </h2>
          </div>

          <p className="text-xl mb-8 text-gray-600 leading-relaxed">
            Embark on an exciting quest to assess your eligibility for
            scholarships and unlock your academic future! Join thousands of
            students who've already discovered their opportunities.
          </p>

          {/* CTA Button */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200" />
            <Button
              asChild
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-lg px-8 py-6 h-auto transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Link href="/scholarship-quest">
                <span className="flex items-center gap-2">
                  Start Your Quest
                  <GraduationCap className="w-5 h-5" />
                </span>
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            {[
              { label: "Students Helped", value: "10,000+" },
              { label: "Success Rate", value: "85%" },
              { label: "Scholarships Found", value: "500+" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="font-bold text-3xl text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
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
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
}

const AnimatedCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative group", className)}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 dark:from-primary/60 dark:to-primary/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient" />
    {children}
  </div>
);
