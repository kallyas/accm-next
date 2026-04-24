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
} from "@/components/ui/card";
import {
  BookOpen,
  Sparkles,
  ChevronRight,
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
    <div className="space-y-8">
      {/* Header with action button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
           <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">Personal Discovery</h1>
           <p className="max-w-2xl text-sm text-[#1A1B4B]/60">
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
        <Card className="col-span-1 border-[#1A1B4B]/20 bg-[#FFFFFF] md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-[#26A649]" />
              Discovery Progress
            </CardTitle>
            <CardDescription className="text-[#1A1B4B]/60">
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
                  <span className="text-xs text-[#1A1B4B]/55">Last updated: {lastUpdated}</span>
                )}
              </div>
              <Progress value={completionPercentage} className="h-2" />
              
              {!user.personalDiscovery && (
                 <Card className="mt-4 border-[#1A1B4B]/15 bg-[#1A1B4B]/5">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Sparkles className="mb-3 mt-2 h-12 w-12 text-[#26A649]" />
                    <h3 className="mb-1 text-lg font-medium text-[#1A1B4B]">Discover Your Career Path</h3>
                    <p className="mb-4 text-sm text-[#1A1B4B]/60">
                      The personal discovery process helps align your strengths, aspirations, and goals with career opportunities
                    </p>
                    <Button asChild className="bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90">
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
        <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-[#26A649]" />
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
                     <div className="rounded bg-[#26A649]/10 p-2 text-xs text-[#26A649]">
                       CV and personal discovery alignment ready for review
                     </div>
                  )}
                </>
              ) : (
                 <div className="text-sm text-[#1A1B4B]/60">
                   Complete your personal discovery to view insights
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Next action card */}
      <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1A1B4B]/10">
              <Lightbulb className="h-5 w-5 text-[#26A649]" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-medium text-[#1A1B4B]">{nextAction.title}</h3>
              <p className="text-sm text-[#1A1B4B]/60">
                {nextAction.description}
              </p>
            </div>
            <Button asChild className="bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90 md:self-end">
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
