import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Search,
  MessageSquare,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { SubscribePlan } from "@/components/user/subscribe-plan";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    icon: GraduationCap,
    title: "International Scholarships Coaching",
    description:
      "Comprehensive guidance for international scholarship applications with structured learning paths and expert mentorship.",
    features: [
      {
        name: "Gold Package (6 months)",
        description:
          "Complete scholarship preparation with personal mentoring, essay reviews, and application strategy.",
      },
      {
        name: "Silver Package (3 months)",
        description:
          "Focused scholarship preparation with group mentoring and application support.",
      },
      {
        name: "Weekly Learning Sessions",
        description:
          "Interactive webinars covering key scholarship topics every Tuesday (7-8pm Ugandan time).",
      },
    ],
    badge: "Most Popular",
  },
  {
    icon: Users,
    title: "Human Capital Development",
    description:
      "Structured learning programs to develop essential professional and leadership skills.",
    features: [
      {
        name: "Leadership Development",
        description:
          "Learn effective leadership strategies and management techniques.",
      },
      {
        name: "Change Management",
        description:
          "Master the skills to navigate and lead organizational change.",
      },
      {
        name: "Professional Excellence",
        description: "Develop core competencies for workplace success.",
      },
      {
        name: "Career Goal Setting",
        description:
          "Create and execute personalized career development plans.",
      },
    ],
  },
  {
    icon: Search,
    title: "Career Development",
    description:
      "Personalized guidance to discover and achieve your career aspirations.",
    features: [
      {
        name: "Career Discovery Workshop",
        description:
          "Interactive sessions to explore your interests, skills, and career options.",
      },
      {
        name: "Personal Development Plan",
        description:
          "Structured approach to identifying and achieving career goals.",
      },
      {
        name: "Professional Growth Strategy",
        description: "Long-term planning for career advancement and success.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Professional Document Preparation",
    description:
      "Expert guidance in creating compelling professional documents that highlight your achievements.",
    features: [
      {
        name: "CV Alignment Workshop",
        description:
          "Learn to craft targeted CVs that match your desired opportunities.",
      },
      {
        name: "Personal Statement Masterclass",
        description: "Write compelling personal statements that stand out.",
      },
      {
        name: "Application Document Package",
        description:
          "Comprehensive support for motivation letters and cover letters.",
      },
    ],
  },
  {
    icon: BookOpen,
    title: "Research & Academic Writing",
    description:
      "Develop strong research and writing skills for academic and professional success.",
    features: [
      {
        name: "Research Methodology Course",
        description:
          "Learn effective research methods and proposal writing techniques.",
      },
      {
        name: "Grant Writing Workshop",
        description: "Master the art of writing successful grant proposals.",
      },
      {
        name: "Scientific Writing Program",
        description: "Enhance your academic and scientific writing skills.",
      },
    ],
  },
  {
    icon: MessageSquare,
    title: "Interview Success Program",
    description:
      "Comprehensive interview preparation to help you present your best self.",
    features: [
      {
        name: "Mock Interview Sessions",
        description: "Practice with real-world scenarios and expert feedback.",
      },
      {
        name: "Interview Strategy Course",
        description: "Learn proven techniques for interview success.",
      },
      {
        name: "Question Preparation Workshop",
        description: "Master common and challenging interview questions.",
      },
    ],
  },
];

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Transform Your Career Journey
        </h1>
        <p className="text-xl text-muted-foreground">
          Embark on a structured learning experience with our comprehensive
          professional development services. Each program is designed to help
          you build skills, gain confidence, and achieve your career goals.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="relative flex flex-col">
              {service.badge && (
                <Badge variant="default" className="absolute top-4 right-4">
                  {service.badge}
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  {service.features.map((feature) => (
                    <div key={feature.name} className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Begin Your Learning Journey?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Choose a subscription plan that suits your needs and get access to our
          comprehensive learning programs.
        </p>
        <SubscribePlan />
        {!session && (
          <div className="mt-8">
            <Link href="/login">
              <Button className="gap-2">
                Start Learning Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
