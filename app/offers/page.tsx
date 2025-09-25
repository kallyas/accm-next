"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  MapPin,
  Phone,
  Star,
  Trophy,
  Users,
  Target,
  BookOpen,
  Award,
  ChevronRight,
  Globe,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const offers = [
  {
    id: 1,
    title: "Global Scholarship Success",
    subtitle: "Countries Where Our Clients Have Won Scholarships",
    image: "/offers/WhatsApp Image 2025-09-24 at 08.04.07.jpeg",
    type: "success-stories",
    badge: "Success Rate 91.3%",
    highlights: [
      "United Kingdom",
      "USA", 
      "Sweden",
      "Thailand",
      "Canada",
      "South Africa",
      "Kenya",
      "India",
      "Germany",
      "Belgium",
      "Israel", 
      "Ireland",
      "Uganda"
    ],
    description: "Our mentees have secured scholarships across 13 countries worldwide",
    cta: "Start Your Journey",
    ctaLink: "/register",
    stats: {
      countries: "13",
      successRate: "91.3%",
      scholarships: "500+"
    }
  },
  {
    id: 2,
    title: "Advanced Degree Programs",
    subtitle: "Courses for Our Mentees",
    image: "/offers/WhatsApp Image 2025-09-24 at 08.04.08.jpeg",
    type: "courses",
    badge: "Premium Programs",
    highlights: [
      "MSc International Development",
      "MSc Civil and Architectural Engineering", 
      "MPhil Modelling for Global Health (University of Oxford)",
      "MPhil International Tropical Medicine (University of Oxford)",
      "MSc Computer Science (Edinburgh)",
      "MPhil Population Health Science (University of Cambridge)",
      "MSc in Water, Sanitation and Health Engineering",
      "MSc Advanced Pharmaceutical Manufacturing",
      "PhD Global Health",
      "PhD Computer Science",
      "PhD Oral Medicine",
      "DPhil Clinical Medicine",
      "MSc Construction Management",
      "Masters of Public Health"
    ],
    description: "Access to world-class graduate programs at top universities",
    cta: "Explore Programs",
    ctaLink: "/courses",
    stats: {
      universities: "Oxford, Cambridge",
      programs: "14+",
      fields: "Multiple"
    }
  },
  {
    id: 3,
    title: "Comprehensive Services",
    subtitle: "Our Professional Services & Pricing",
    image: "/offers/WhatsApp Image 2025-09-24 at 08.04.08 (2).jpeg",
    type: "services",
    badge: "Affordable Rates",
    highlights: [
      "International Scholarships Application Coaching - UGX 500,000 (USD 150)",
      "Research, grants and scientific writing - UGX 500,000 (USD 150)",
      "CV Alignment - UGX 100,000 (USD 30)",
      "Motivation Letter/Personal Statement Review - UGX 100,000 (USD 30)",
      "Career guidance and personal discovery - UGX 100,000 (USD 30)",
      "Cover letter writing - UGX 100,000 (USD 30)",
      "Human Capital Development - It varies",
      "2 University - It varies"
    ],
    description: "Professional career development services at competitive rates",
    cta: "Book Service",
    ctaLink: "/services",
    contact: {
      mobile: "+256 752 206 865",
      name: "ABEL WILSON WALEKHWA"
    }
  },
  {
    id: 4,
    title: "Scholarship Achievement",
    subtitle: "Our Track Record of Excellence",
    image: "/offers/WhatsApp Image 2025-09-24 at 08.04.08 (3).jpeg",
    type: "achievements",
    badge: "Proven Success",
    highlights: [
      "41 Full Scholarships Secured",
      "01 Bachelor's",
      "25 Master's", 
      "15 PhD",
      "Countries: 13"
    ],
    description: "Outstanding track record with 91.3% success rate in scholarship applications",
    cta: "See Success Stories",
    ctaLink: "/gallery",
    stats: {
      total: "41",
      bachelors: "1",
      masters: "25",
      phd: "15"
    }
  },
  {
    id: 5,
    title: "Scholarship Coaching Packages",
    subtitle: "International Scholarship Application Coaching",
    image: "/offers/WhatsApp Image 2025-09-24 at 08.04.08 (1).jpeg",
    type: "packages",
    badge: "Coaching Programs",
    highlights: [
      "Personal Discovery using the 4W framework",
      "Personal statement/Motivational letter review",
      "Interview Applications (if applicable)",
      "Scientific Writing",
      "Curriculum Vitae realignment", 
      "International Online Branding",
      "No limit to number of 'quality' scholarship applications"
    ],
    packages: [
      {
        name: "Silver Package",
        duration: "3 months",
        price: "UGX 500K ($150)"
      },
      {
        name: "Gold Package", 
        duration: "6 months",
        price: "UGX 1M ($300)"
      }
    ],
    description: "Comprehensive coaching packages for scholarship applications",
    cta: "Choose Package",
    ctaLink: "/services",
    contact: {
      website: "www.africanccm.org",
      phone: "+447502244173"
    }
  }
];

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

export default function OffersPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success-stories":
        return <Trophy className="h-5 w-5" />;
      case "courses":
        return <BookOpen className="h-5 w-5" />;
      case "services":
        return <Target className="h-5 w-5" />;
      case "achievements":
        return <Award className="h-5 w-5" />;
      case "packages":
        return <Users className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success-stories":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "courses":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "services":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "achievements":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "packages":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-gray-900 dark:to-green-950"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-400 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-400 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Star className="h-4 w-4 mr-2" />
              Special Offers & Opportunities
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Exclusive Opportunities
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Discover our comprehensive range of services, success stories, and opportunities 
              designed to accelerate your career and academic journey
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                  Get Started Today
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="px-8 py-3 rounded-full">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offers Grid */}
      <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {offers.map((offer, index) => (
              <motion.div key={offer.id} variants={itemVariants}>
                <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-gray-800 rounded-2xl">
                  {/* Image Section */}
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getTypeColor(offer.type)} border-0`}>
                        {getTypeIcon(offer.type)}
                        <span className="ml-2">{offer.badge}</span>
                      </Badge>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {offer.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {offer.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 font-medium">
                      {offer.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {offer.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Key Highlights:</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {offer.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    {offer.stats && (
                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                        {Object.entries(offer.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-bold text-lg text-blue-600">{value}</div>
                            <div className="text-xs text-gray-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Packages */}
                    {offer.packages && (
                      <div className="space-y-2">
                        {offer.packages.map((pkg, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <div className="font-semibold text-sm">{pkg.name}</div>
                              <div className="text-xs text-gray-500">{pkg.duration}</div>
                            </div>
                            <div className="font-bold text-blue-600">{pkg.price}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Contact Info */}
                    {offer.contact && (
                      <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        {offer.contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span>{offer.contact.phone}</span>
                          </div>
                        )}
                        {offer.contact.mobile && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span>{offer.contact.mobile}</span>
                          </div>
                        )}
                        {offer.contact.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span>{offer.contact.website}</span>
                          </div>
                        )}
                        {offer.contact.name && (
                          <div className="text-sm font-semibold text-blue-600">
                            {offer.contact.name}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-4">
                      <Link href={offer.ctaLink} className="block">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full group/btn">
                          {offer.cta}
                          <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have achieved their dreams with our guidance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8 py-3 rounded-full">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-8 py-3 rounded-full border-white text-white hover:bg-white hover:text-blue-600">
                  Get Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}