import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  AlertCircle,
  CreditCard,
  UserCircle,
  FileText,
  GraduationCap,
  ArrowLeft,
  Info,
} from "lucide-react";

interface PageProps {
  searchParams: {
    message?: string;
    returnTo?: string;
  };
}

export default async function StatusPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { subscriptions: true },
  });

  if (!user) {
    redirect("/login");
  }

  if (
    user.progressStatus !== "PAYMENT_PENDING" &&
    user.progressStatus !== "PERSONAL_DISCOVERY_PENDING"
  ) {
    redirect("/dashboard");
  }

  const message = searchParams.message
    ? decodeURIComponent(searchParams.message)
    : null;

  const returnTo = searchParams.returnTo
    ? decodeURIComponent(searchParams.returnTo)
    : null;

  const steps = [
    {
      title: "Payment",
      description: "Complete your subscription payment",
      icon: CreditCard,
      status: user.subscriptions.some((sub) => sub.status === "ACTIVE")
        ? "completed"
        : "pending",
      action: user.subscriptions.some((sub) => sub.status === "PENDING")
        ? "Awaiting approval"
        : "Subscribe now",
      link: "/dashboard/billing",
    },
    {
      title: "Personal Discovery",
      description: "Complete your personal profile",
      icon: UserCircle,
      status:
        user.progressStatus === "PERSONAL_DISCOVERY_PENDING"
          ? "current"
          : "upcoming",
      action: "Start now",
      link: "/dashboard/personal-discovery",
    },
    {
      title: "CV Alignment",
      description: "Upload and align your CV",
      icon: FileText,
      status: "upcoming",
      action: "Align now",
      link: "/cv-alignment",
    },
    {
      title: "Scholarship Matrix",
      description: "Complete your scholarship assessment",
      icon: GraduationCap,
      status: "upcoming",
      action: "Coming soon",
      link: "#",
    },
  ];

  // Calculate progress
  const completedSteps = steps.filter(
    (step) => step.status === "completed"
  ).length;
  const progress = (completedSteps / steps.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "current":
        return <Circle className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "success",
      current: "default",
      upcoming: "secondary",
      pending: "warning",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-10">
        {message && (
          <div className="mb-6">
            <Alert className="alert-info alert-accented alert-animate-in relative border-l-4 border-blue-500">
              <Info className="h-5 w-5" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                {message}
                {returnTo && (
                  <div className="mt-2">
                    <Link
                      href={returnTo}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Return after {message.toLowerCase()}
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Your Journey</h1>
            <p className="text-muted-foreground text-lg">
              Complete these steps to unlock all features of Pearl Mentor Hub.
            </p>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>
                {completedSteps} of {steps.length} steps completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Steps Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className={
                    step.status === "current"
                      ? "border-2 border-primary"
                      : undefined
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-muted p-2">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle>{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(step.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(step.status)}
                      <span className="text-sm text-muted-foreground">
                        {step.status === "completed"
                          ? "Completed"
                          : step.status === "current"
                          ? "In Progress"
                          : "Not Started"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      asChild
                      disabled={step.status === "upcoming" || step.status === "completed"}
                      variant={
                        step.status === "current" ? "default" : "outline"
                      }
                    >
                      <Link
                        href={step.link}
                        className="flex items-center justify-center"
                      >
                        {step.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
