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
  Lock,
} from "lucide-react";

interface PageProps {
  searchParams: {
    message?: string;
    returnTo?: string;
  };
}

type StepStatus = 'completed' | 'current' | 'upcoming' | 'pending' | 'locked';

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  status: StepStatus;
  action: string;
  link: string;
  requiresPrevious?: boolean;
}

export default async function StatusPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: { subscriptions: true },
  });

  const message = searchParams.message
    ? decodeURIComponent(searchParams.message)
    : null;

  const returnTo = searchParams.returnTo
    ? decodeURIComponent(searchParams.returnTo)
    : null;

  // Define step completion conditions
  const hasActiveSubscription = user?.subscriptions.some(
    (sub) => sub.status === "ACTIVE"
  );
  const hasPendingSubscription = user?.subscriptions.some(
    (sub) => sub.status === "PENDING"
  );
  const hasCompletedPersonalDiscovery = 
    user?.progressStatus !== "PERSONAL_DISCOVERY_PENDING" && 
    user?.progressStatus !== undefined && hasActiveSubscription;
  const hasCompletedCVAlignment = 
    user?.progressStatus !== "CV_ALIGNMENT_PENDING" && 
    hasCompletedPersonalDiscovery && hasActiveSubscription;

  // Helper function to determine step status
  const determineStepStatus = (
    index: number,
    isCompleted: boolean,
    previousCompleted: boolean
  ): StepStatus => {
    if (isCompleted) return 'completed';
    if (!previousCompleted) return 'locked';
    if (index === 0 || previousCompleted) return 'current';
    return 'upcoming';
  };

  const steps: Step[] = [
    {
      title: "Payment",
      description: "Complete your subscription payment",
      icon: CreditCard,
      status: hasActiveSubscription 
        ? 'completed' 
        : 'current',
      action: hasPendingSubscription 
        ? "Awaiting approval"
        : "Subscribe now",
      link: "/dashboard/billing",
      requiresPrevious: false,
    },
    {
      title: "Personal Discovery",
      description: "Complete your personal profile",
      icon: UserCircle,
      status: determineStepStatus(1, !!hasCompletedPersonalDiscovery, !!hasActiveSubscription),
      action: hasCompletedPersonalDiscovery 
        ? "Completed" 
        : "Start now",
      link: "/dashboard/personal-discovery",
      requiresPrevious: true,
    },
    {
      title: "CV Alignment",
      description: "Upload and align your CV",
      icon: FileText,
      status: determineStepStatus(2, !!hasCompletedCVAlignment, !!hasCompletedPersonalDiscovery),
      action: hasCompletedCVAlignment 
        ? "Completed" 
        : "Align now",
      link: "/cv-alignment",
      requiresPrevious: true,
    },
    {
      title: "Scholarship Matrix",
      description: "Complete your scholarship assessment",
      icon: GraduationCap,
      status: determineStepStatus(3, false, !!hasCompletedCVAlignment),
      action: "Start assessment",
      link: "/scholarship-quest",
      requiresPrevious: true,
    },
  ];

  // Calculate progress
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Circle className="h-5 w-5 text-blue-500" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: StepStatus) => {
    const variants = {
      completed: "success",
      current: "default",
      upcoming: "secondary",
      pending: "warning",
      locked: "secondary",
    } as const;

    const labels = {
      completed: "Completed",
      current: "In Progress",
      upcoming: "Upcoming",
      pending: "Pending",
      locked: "Locked",
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const isStepAccessible = (index: number): boolean => {
    if (index === 0) return true;
    const previousStep = steps[index - 1];
    return previousStep.status === 'completed';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-10">
        {message && (
          <div className="mb-6">
            <Alert className="relative border-l-4 border-blue-500 alert-info alert-with-icon alert-accented">
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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Your Journey</h1>
            <p className="text-lg text-muted-foreground">
              Complete these steps to unlock all features of ACCM
            </p>
          </div>

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

          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isAccessible = isStepAccessible(index);
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              
              return (
                <Card
                  key={index}
                  className={`${
                    isCurrent ? "border-2 border-primary" : ""
                  } ${
                    !isAccessible ? "opacity-75" : ""
                  }`}
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
                        {step.status === 'locked' 
                          ? "Complete previous steps first"
                          : step.status === 'completed'
                          ? "Completed"
                          : step.status === 'current'
                          ? "In Progress"
                          : "Not Started"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      asChild={isAccessible && !isCompleted}
                      disabled={!isAccessible || isCompleted || step.action === "Awaiting approval"}
                      variant={isCurrent ? "default" : "outline"}
                    >
                      <Link
                        href={isAccessible ? step.link : "#"}
                        className="flex items-center justify-center"
                      >
                        {isCompleted 
                          ? "Completed" 
                          : !isAccessible 
                          ? "Locked" 
                          : step.action}
                        {isAccessible && !isCompleted && (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
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