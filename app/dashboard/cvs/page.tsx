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
  Award, 
  TrendingUp, 
  BarChart,
  Bookmark,
  Sparkles
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
         icon: <FileText className="h-5 w-5 text-[#1A1B4B]" />,
      };
    }

    if (stats.analyzedCVs < stats.totalCVs) {
      return {
        title: "Complete CV Analysis",
        description: "You have CVs that haven't been fully analyzed yet",
        actionText: "Continue Analysis",
        actionLink: "/cv-alignment",
         icon: <BarChart className="h-5 w-5 text-[#1A1B4B]" />,
      };
    }

    return {
      title: "Review Your Analysis",
      description: "Continue improving your CV based on our recommendations",
      actionText: "View Analysis",
      actionLink: "#cv-list",
       icon: <TrendingUp className="h-5 w-5 text-[#1A1B4B]" />,
    };
  };

  const nextAction = getNextAction();

return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
          Career Tools
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          My CVs
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          Manage your CVs and track improvement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#1A1B4B]/60">Total CVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{stats.totalCVs}</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1B4B]/10">
                <FileText className="h-6 w-6 text-[#1A1B4B]" />
              </div>
            </div>
            <p className="text-xs text-[#1A1B4B]/60 mt-2">
              {stats.lastUpdated 
                ? `Last updated ${formatDistanceToNow(stats.lastUpdated, { addSuffix: true })}` 
                : "No CVs uploaded yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#1A1B4B]/60">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">
                {stats.bestScore > 0 ? stats.bestScore : "N/A"}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26A649]/10">
                <Award className="h-6 w-6 text-[#26A649]" />
              </div>
            </div>
            <p className="text-xs text-[#1A1B4B]/60 mt-2">
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

        <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#1A1B4B]/60">Progress Status</CardTitle>
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1B4B]/10">
                <TrendingUp className="h-6 w-6 text-[#1A1B4B]" />
              </div>
            </div>
            <p className="text-xs text-[#1A1B4B]/60 mt-2">
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
      <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1A1B4B]/10">
              {nextAction.icon}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-medium text-[#1A1B4B]">{nextAction.title}</h3>
              <p className="text-sm text-[#1A1B4B]/60">
                {nextAction.description}
              </p>
            </div>
            <Button asChild className="bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90 md:self-end">
              <Link href={nextAction.actionLink}>
                {nextAction.actionText}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips box (if user has CVs) */}
      {stats.totalCVs > 0 && (
        <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Bookmark className="mr-2 h-4 w-4 text-[#26A649]" />
              CV Improvement Tips
            </CardTitle>
            <CardDescription>Quick tips to enhance your CV quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1B4B]/10 text-xs text-[#1A1B4B]">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Use action verbs</h4>
                    <p className="text-xs text-[#1A1B4B]/60">
                      Start bullet points with powerful action verbs like &quot;achieved,&quot; &quot;implemented,&quot; or &quot;led&quot;
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1B4B]/10 text-xs text-[#1A1B4B]">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Quantify achievements</h4>
                    <p className="text-xs text-[#1A1B4B]/60">Include specific metrics and percentages to demonstrate your impact</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1B4B]/10 text-xs text-[#1A1B4B]">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Tailor to job descriptions</h4>
                    <p className="text-xs text-[#1A1B4B]/60">Customize your CV for each application by matching keywords</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1B4B]/10 text-xs text-[#1A1B4B]">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Keep it concise</h4>
                    <p className="text-xs text-[#1A1B4B]/60">Aim for 1-2 pages with focused, relevant content for your target role</p>
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
