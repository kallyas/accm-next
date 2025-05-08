import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CVList } from "@/components/cv-list";
import { getR2Url } from "@/lib/cloudflare-r2";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FileText, 
  PlusCircle, 
  Award, 
  TrendingUp, 
  BarChart,
  Bookmark
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

export default async function UserCVsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/login?callbackUrl=/dashboard/cvs");
  }

  // Get user information and preferences
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      lastName: true,
      firstName: true,
      email: true,
      progressStatus: true,
    },
  });

  // Get all user CVs
  const cvs = await Promise.all(
    (
      await db.cV.findMany({
        where: { userId: session.user.id },
        orderBy: { uploadedAt: "desc" },
      })
    ).map(async (cv) => ({
      ...cv,
      uploadedAt: cv.uploadedAt.toISOString(),
      fileUrl: await getR2Url(cv.fileUrl),
    }))
  );

  // Calculate statistics
  const stats = {
    totalCVs: cvs.length,
    analyzedCVs: cvs.filter(cv => cv.analysisResult).length,
    bestScore: 0,
    lastUpdated: cvs.length > 0 ? new Date(cvs[0].uploadedAt) : null,
  };

  // Find best score
  if (stats.analyzedCVs > 0) {
    stats.bestScore = cvs.reduce((max, cv) => {
      if (!cv.analysisResult) return max;
      const analysis = JSON.parse(cv.analysisResult);
      return Math.max(max, analysis.overallScore || 0);
    }, 0);
  }

  // Determine next suggested action based on user's progress
  const getNextAction = () => {
    if (stats.totalCVs === 0) {
      return {
        title: "Upload Your First CV",
        description: "Start by uploading your CV for professional analysis",
        actionText: "Upload CV",
        actionLink: "/cv-alignment",
        icon: <FileText className="h-5 w-5 text-blue-500" />,
      };
    }

    if (stats.analyzedCVs < stats.totalCVs) {
      return {
        title: "Complete CV Analysis",
        description: "You have CVs that haven't been fully analyzed yet",
        actionText: "Continue Analysis",
        actionLink: "/cv-alignment",
        icon: <BarChart className="h-5 w-5 text-orange-500" />,
      };
    }

    return {
      title: "Review Your Analysis",
      description: "Continue improving your CV based on our recommendations",
      actionText: "View Analysis",
      actionLink: "#cv-list",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="container py-10 space-y-8">
      {/* Page header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">My CVs & Analyses</h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage your CVs, view analysis results, and track your improvement over time
          </p>
        </div>
        <Button asChild>
          <Link href="/cv-alignment">
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload New CV
          </Link>
        </Button>
      </div>

      {/* Statistic cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total CVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{stats.totalCVs}</div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.lastUpdated 
                ? `Last updated ${formatDistanceToNow(stats.lastUpdated, { addSuffix: true })}` 
                : "No CVs uploaded yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">
                {stats.bestScore > 0 ? stats.bestScore : "N/A"}
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.bestScore >= 90 
                ? "Outstanding CV - excellent work!" 
                : stats.bestScore >= 80 
                ? "Great CV - small improvements possible" 
                : stats.bestScore >= 70 
                ? "Good CV - some improvements recommended" 
                : stats.bestScore > 0 
                ? "CV needs significant improvements" 
                : "No CV analyzed yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Progress Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium truncate max-w-[180px]">
                {user?.progressStatus === "PAYMENT_PENDING" && "Payment Pending"}
                {user?.progressStatus === "PERSONAL_DISCOVERY_PENDING" && "Personal Discovery"}
                {user?.progressStatus === "CV_ALIGNMENT_PENDING" && "CV Alignment"}
                {user?.progressStatus === "SCHOLARSHIP_MATRIX_PENDING" && "Scholarship Matrix"}
                {!user?.progressStatus && "Getting Started"}
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {user?.progressStatus === "PAYMENT_PENDING" && "Complete payment to unlock all features"}
              {user?.progressStatus === "PERSONAL_DISCOVERY_PENDING" && "Complete your personal discovery questionnaire"}
              {user?.progressStatus === "CV_ALIGNMENT_PENDING" && "Upload and analyze your CV"}
              {user?.progressStatus === "SCHOLARSHIP_MATRIX_PENDING" && "Complete your scholarship matrix"}
              {!user?.progressStatus && "Welcome! Start your journey with us"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next action card */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-100 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              {nextAction.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">{nextAction.title}</h3>
              <p className="text-sm text-muted-foreground">
                {nextAction.description}
              </p>
            </div>
            <Button asChild className="md:self-end">
              <Link href={nextAction.actionLink}>
                {nextAction.actionText}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips box (if user has CVs) */}
      {stats.totalCVs > 0 && (
        <Card className="bg-muted/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Bookmark className="mr-2 h-4 w-4 text-blue-500" />
              CV Improvement Tips
            </CardTitle>
            <CardDescription>Quick tips to enhance your CV quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Use action verbs</h4>
                    <p className="text-xs text-muted-foreground">Start bullet points with powerful action verbs like "achieved," "implemented," or "led"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Quantify achievements</h4>
                    <p className="text-xs text-muted-foreground">Include specific metrics and percentages to demonstrate your impact</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Tailor to job descriptions</h4>
                    <p className="text-xs text-muted-foreground">Customize your CV for each application by matching keywords</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Keep it concise</h4>
                    <p className="text-xs text-muted-foreground">Aim for 1-2 pages with focused, relevant content for your target role</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CV list section */}
      <div id="cv-list">
        <Separator className="my-6" />
        <CVList initialCvs={cvs} />
      </div>
    </div>
  );
}