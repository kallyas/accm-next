import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Lock,
  CreditCard,
  UserCircle,
  FileText,
  GraduationCap,
  Sparkles,
} from "lucide-react";

type StepStatus = 'completed' | 'current' | 'upcoming' | 'locked';

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  status: StepStatus;
  action: string;
  link: string;
}

export default async function StatusPage() {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: { subscriptions: true },
  });

  const hasActiveSubscription = user?.subscriptions.some((sub) => sub.status === "ACTIVE");
  const hasPendingSubscription = user?.subscriptions.some((sub) => sub.status === "PENDING");
  const hasCompletedPersonalDiscovery = user?.progressStatus !== "PERSONAL_DISCOVERY_PENDING" && user?.progressStatus !== undefined && hasActiveSubscription;
  const hasCompletedCVAlignment = user?.progressStatus !== "CV_ALIGNMENT_PENDING" && hasCompletedPersonalDiscovery && hasActiveSubscription;

  const determineStepStatus = (index: number, isCompleted: boolean, previousCompleted: boolean): StepStatus => {
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
      status: hasActiveSubscription ? 'completed' : 'current',
      action: hasPendingSubscription ? "Awaiting approval" : "Subscribe now",
      link: "/dashboard/billing",
    },
    {
      title: "Personal Discovery",
      description: "Complete your personal profile",
      icon: UserCircle,
      status: determineStepStatus(1, !!hasCompletedPersonalDiscovery, !!hasActiveSubscription),
      action: hasCompletedPersonalDiscovery ? "Completed" : "Start now",
      link: "/dashboard/personal-discovery",
    },
    {
      title: "CV Alignment",
      description: "Upload and align your CV",
      icon: FileText,
      status: determineStepStatus(2, !!hasCompletedCVAlignment, !!hasCompletedPersonalDiscovery),
      action: hasCompletedCVAlignment ? "Completed" : "Align now",
      link: "/cv-alignment",
    },
    {
      title: "Scholarship Matrix",
      description: "Complete scholarship assessment",
      icon: GraduationCap,
      status: determineStepStatus(3, false, !!hasCompletedCVAlignment),
      action: "Start assessment",
      link: "/scholarship-quest",
    },
  ];

  const completedSteps = steps.filter((step) => step.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  const isStepAccessible = (index: number): boolean => {
    if (index === 0) return true;
    return steps[index - 1].status === 'completed';
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
          Your journey
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          Complete these steps
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          Unlock all features of ACCM by completing each step
        </p>
      </div>

      <Card className="border border-[#1A1B4B]/20 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-wider text-[#1A1B4B]">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" style={{ "--progress-fill": "#26A649" } as React.CSSProperties} />
          <p className="mt-2 text-xs text-[#1A1B4B]/50">
            {completedSteps} of {steps.length} steps completed
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isAccessible = isStepAccessible(index);
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div key={index}>
              <Card
                className={`h-full border ${
                  isCurrent
                    ? "border-[#1A1B4B] bg-white"
                    : "border-[#1A1B4B]/10 bg-white"
                } ${!isAccessible ? "opacity-60" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border border-[#1A1B4B]/20 bg-[#ece8df]">
                        <Icon className="h-5 w-5 text-[#1A1B4B]" />
                      </div>
                      <div>
                        <CardTitle className="text-sm uppercase tracking-wide text-[#1A1B4B]">
                          {step.title}
                        </CardTitle>
                      </div>
                    </div>
                    {isCompleted && (
                      <Badge variant="outline" className="border-[#26A649]/30 text-[#26A649]">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Done
                      </Badge>
                    )}
                    {step.status === 'locked' && (
                      <Badge variant="outline" className="border-[#1A1B4B]/20 text-[#1A1B4B]/50">
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge className="bg-[#1A1B4B] text-white">In Progress</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-xs text-[#1A1B4B]/60">{step.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    disabled={!isAccessible || isCompleted || step.action === "Awaiting approval"}
                    className={`w-full h-9 text-xs uppercase tracking-wider ${
                      isCompleted
                        ? "border border-[#26A649]/30 text-[#26A649] bg-transparent"
                        : isAccessible
                        ? "bg-[#1A1B4B] text-white"
                        : "border border-[#1A1B4B]/20 text-[#1A1B4B]/50 bg-transparent"
                    }`}
                  >
                    <Link href={isAccessible ? step.link : "#"} className="flex items-center justify-center">
                      {isCompleted ? "Completed" : !isAccessible ? "Locked" : step.action}
                      {isAccessible && !isCompleted && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}