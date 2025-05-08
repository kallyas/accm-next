import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PersonalDiscovery } from "@/components/personal-discovery";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  Share2,
  Download,
  BarChart2,
  Lightbulb,
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default async function PersonalDiscoveryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/personal-discovery");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { 
      personalDiscovery: true,
      cvs: {
        orderBy: { uploadedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Determine completion percentage
  const getCompletionPercentage = () => {
    if (!user.personalDiscovery) return 0;
    
    const sections = [
      'strengths', 'weaknesses', 'opportunities', 'threats',
      'achievements', 'familyAspirations', 'careerAspirations',
      'financialBusinessAspirations', 'socialAspirations',
      'desiredPosition', 'requiredSkills', 'coursesAndTrainings',
      'strategies', 'shortTermGoals'
    ];
    
    const filledSections = sections.filter(section => 
      user.personalDiscovery && 
      user.personalDiscovery[section] &&
      (Array.isArray(user.personalDiscovery[section]) 
        ? user.personalDiscovery[section].length > 0
        : user.personalDiscovery[section].trim() !== '')
    );
    
    return Math.round((filledSections.length / sections.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();
  
  // Check if there's a pending CV upload
  const hasPendingCV = user.progressStatus === "CV_ALIGNMENT_PENDING";
  
  
  // Determine next steps based on user's progress
  const getNextAction = () => {
    if (!user.personalDiscovery) {
      return {
        title: "Start Your Personal Discovery Journey",
        description: "Complete the questionnaire to begin understanding your career aspirations and strengths",
        cta: "Begin Questionnaire",
        href: "/dashboard/personal-discovery/start"
      };
    }
    
    if (completionPercentage < 100) {
      return {
        title: "Complete Your Personal Discovery",
        description: "You've made progress, but still have some sections to fill in",
        cta: "Continue Questionnaire",
        href: "/dashboard/personal-discovery/start"
      };
    }
    
    if (hasPendingCV) {
      return {
        title: "Upload Your CV for Analysis",
        description: "Now that you've completed your personal discovery, analyze your CV to align it with your goals",
        cta: "Upload CV",
        href: "/cv-alignment"
      };
    }
    
    
    return {
      title: "Review Your Analysis",
      description: "Explore insights from your personal discovery",
      cta: "View Analysis",
      href: "#discovery-details"
    };
  };
  
  const nextAction = getNextAction();
  
  // Calculate last updated date
  const lastUpdated = user.personalDiscovery?.updatedAt 
    ? format(new Date(user.personalDiscovery.updatedAt), "MMMM d, yyyy")
    : null;

  return (
    <div className="container py-10 space-y-8">
      {/* Header with action button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Personal Discovery</h1>
          <p className="text-muted-foreground max-w-2xl">
            Your personalized 4W Framework self-assessment for career alignment and growth
          </p>
        </div>
        {user.personalDiscovery && (
          <Button asChild>
            <Link href="/dashboard/personal-discovery/start">
              {completionPercentage < 100 ? "Continue" : "Edit"} Personal Discovery
            </Link>
          </Button>
        )}
      </div>
      
      {/* Progress and stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
              Discovery Progress
            </CardTitle>
            <CardDescription>
              {!user.personalDiscovery 
                ? "Begin your personal discovery journey"
                : completionPercentage < 100
                  ? "Continue filling in your personal discovery"
                  : "You've completed your personal discovery"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{completionPercentage}% Complete</span>
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground">Last updated: {lastUpdated}</span>
                )}
              </div>
              <Progress value={completionPercentage} className="h-2" />
              
              {!user.personalDiscovery && (
                <Card className="bg-muted mt-4">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Sparkles className="h-12 w-12 text-blue-500 mb-3 mt-2" />
                    <h3 className="text-lg font-medium mb-1">Discover Your Career Path</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The personal discovery process helps align your strengths, aspirations, and goals with career opportunities
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/personal-discovery/start">
                        Start Questionnaire
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <div className="space-y-4">
              {user.personalDiscovery ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Top Strengths</span>
                      <span className="font-medium">{user.personalDiscovery.strengths?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Career Goals</span>
                      <span className="font-medium">{user.personalDiscovery.careerAspirations ? "Defined" : "Not set"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Desired Positions</span>
                      <span className="font-medium">{user.personalDiscovery.desiredPosition?.length || 0}</span>
                    </div>
                  </div>
                  {completionPercentage === 100 && user.cvs && user.cvs.length > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      CV and personal discovery alignment ready for review
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Complete your personal discovery to view insights
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Next action card */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-100 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">{nextAction.title}</h3>
              <p className="text-sm text-muted-foreground">
                {nextAction.description}
              </p>
            </div>
            <Button asChild className="md:self-end">
              <Link href={nextAction.href}>
                {nextAction.cta}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Personal Discovery component or empty state */}
      <div id="discovery-details">
        <Separator className="my-6" />
        <PersonalDiscovery personalDiscovery={user.personalDiscovery} />
      </div>
    </div>
  );
}

