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
import { StatisticsSection } from "@/components/statistics-section";
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
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  Rocket,
  Target,
  TargetIcon,
  Users,
  Zap,
} from "lucide-react";

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
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Carousel className="w-full rounded-lg mt-8">
          <CarouselContent>
            {carouselSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[60vh] w-full">
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
                      <Button asChild>
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

        <ServicesSection />

        <StatisticsSection />

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
                  <Button size="lg">Join Now</Button>
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
              Start your journey towards career success with Pearl Mentor Hub
              today.
            </p>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
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
      details: {
        overview:
          "A comprehensive approach to professional growth combining one-on-one mentorship, executive coaching, and personalized career strategies.",
        keyFeatures: [
          "Individual career mapping",
          "Personalized mentorship programs",
          "Executive-level strategic guidance",
          "Targeted professional development",
        ],
        serviceComponents: [
          {
            name: "One-on-One Mentorship",
            focus: [
              "Career path alignment",
              "Skill gap analysis",
              "Personal branding",
              "Professional confidence building",
            ],
          },
          {
            name: "Executive Coaching",
            focus: [
              "Leadership development",
              "Strategic career positioning",
              "High-performance mindset",
              "Organizational influence",
            ],
          },
        ],
        idealFor: [
          "Early to mid-career professionals",
          "Emerging leaders",
          "Career transition specialists",
          "Individuals seeking strategic career growth",
        ],
      },
    },
    {
      value: "skill-enhancement",
      title: "Workshops",
      description: "Comprehensive skill development programs",
      icon: Rocket,
      details: {
        overview:
          "Immersive learning experiences designed to build critical professional skills through workshops, technology training, and interactive learning.",
        keyFeatures: [
          "Interactive skill-building workshops",
          "Technology career acceleration",
          "Practical learning methodologies",
          "Industry-relevant skill development",
        ],
        serviceComponents: [
          {
            name: "Career Development Workshops",
            focus: [
              "Leadership skills",
              "Communication techniques",
              "Negotiation strategies",
              "Problem-solving methodologies",
            ],
          },
          {
            name: "Tech Career Acceleration",
            focus: [
              "Cutting-edge tech skills",
              "AI and machine learning",
              "Cloud computing",
              "Cybersecurity insights",
            ],
          },
        ],
        idealFor: [
          "Professionals seeking skill upgradation",
          "Technology enthusiasts",
          "Team leaders and managers",
          "Individuals in dynamic industries",
        ],
      },
    },
    {
      value: "learning-resources",
      title: "Resources",
      description:
        "Comprehensive learning and professional connection platforms",
      icon: BookOpen,
      details: {
        overview:
          "A holistic approach to professional development through extensive resources, flexible learning platforms, and strategic networking opportunities.",
        keyFeatures: [
          "Extensive digital learning library",
          "Multi-format educational content",
          "Professional networking platforms",
          "Continuous learning ecosystem",
        ],
        serviceComponents: [
          {
            name: "Career Resources Library",
            focus: [
              "E-books and guides",
              "Video masterclasses",
              "Industry insights",
              "Self-paced learning",
            ],
          },
          {
            name: "Professional Networking",
            focus: [
              "Virtual networking events",
              "Industry conferences",
              "Professional community circles",
              "Strategic connection building",
            ],
          },
        ],
        idealFor: [
          "Self-motivated learners",
          "Professionals expanding their network",
          "Job seekers",
          "Individuals seeking flexible learning",
        ],
      },
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Professional Development Services
        </h2>
        <Tabs defaultValue="personalized-development" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {services.map((service) => (
              <TabsTrigger
                key={service.value}
                value={service.value}
                className="flex items-center gap-2"
              >
                <service.icon className="h-5 w-5" />
                {service.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {services.map((service) => (
            <TabsContent key={service.value} value={service.value}>
              <Card>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Overview</h3>
                      <p className="text-muted-foreground mb-4">
                        {service.details.overview}
                      </p>

                      <h4 className="font-medium mb-2">Key Features</h4>
                      <ul className="space-y-2 mb-4 pl-4 list-disc">
                        {service.details.keyFeatures?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Service Components</h4>
                      {service.details.serviceComponents?.map(
                        (component, idx) => (
                          <div key={idx} className="mb-4">
                            <h5 className="font-semibold">{component.name}</h5>
                            <ul className="pl-4 list-disc">
                              {component.focus.map((item, itemIdx) => (
                                <li key={itemIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}

                      <h4 className="font-medium mb-2 mt-4">Ideal For</h4>
                      <ul className="space-y-2 pl-4 list-disc">
                        {service.details.idealFor?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
