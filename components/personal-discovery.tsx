"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  FileText,
  ChevronRight,
  Star,
  AlertTriangle,
  Lightbulb,
  Award,
  Target,
  BookOpen,
  Download,
  Share2,
  Printer,
  Copy,
  Users,
  Briefcase,
  Home,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type PersonalDiscoveryData = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  achievements: string[];
  threats: string[];
  familyAspirations: string[];
  careerAspirations: string[];
  financialBusinessAspirations: string[];
  socialAspirations: string[];
  desiredPosition: string[];
  requiredSkills: string[];
  coursesAndTrainings: string[];
  strategies: string[];
  shortTermGoals: string[];
  documentAnalysis: string | null;
  updatedAt?: Date;
};

interface CategoryInfo {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export function PersonalDiscovery({
  personalDiscovery,
}: {
  personalDiscovery: PersonalDiscoveryData | null;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Empty state when no data exists
  if (!personalDiscovery) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Personal Discovery
          </CardTitle>
          <CardDescription>
            You haven't completed your personal discovery questionnaire yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center py-12">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-4">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            Begin Your Self-Discovery Journey
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Complete the personal discovery questionnaire to identify your
            strengths, weaknesses, opportunities, and align your career goals
            with your aspirations.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard/personal-discovery/start">
              Start Personal Discovery
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Define category information for visualization
  const categories: Record<string, CategoryInfo> = {
    strengths: {
      title: "Strengths",
      icon: <Star className="h-4 w-4 text-amber-500" />,
      description: "Your core capabilities and assets",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
    weaknesses: {
      title: "Weaknesses",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      description: "Areas that need improvement",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
    opportunities: {
      title: "Opportunities",
      icon: <Lightbulb className="h-4 w-4 text-blue-500" />,
      description: "Potential paths for growth",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    threats: {
      title: "Threats",
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      description: "Challenges to be aware of",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    },
    achievements: {
      title: "Achievements",
      icon: <Award className="h-4 w-4 text-purple-500" />,
      description: "Your accomplishments",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    familyAspirations: {
      title: "Family Aspirations",
      icon: <Home className="h-4 w-4 text-green-500" />,
      description: "Your family goals",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    careerAspirations: {
      title: "Career Aspirations",
      icon: <Briefcase className="h-4 w-4 text-blue-500" />,
      description: "Your professional goals",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    financialBusinessAspirations: {
      title: "Financial/Business Aspirations",
      icon: <DollarSign className="h-4 w-4 text-emerald-500" />,
      description: "Your financial goals",
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    socialAspirations: {
      title: "Social Aspirations",
      icon: <Users className="h-4 w-4 text-indigo-500" />,
      description: "Your community goals",
      color:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    },
    desiredPosition: {
      title: "Desired Position",
      icon: <Target className="h-4 w-4 text-rose-500" />,
      description: "Roles you aspire to",
      color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    },
    requiredSkills: {
      title: "Required Skills",
      icon: <GraduationCap className="h-4 w-4 text-cyan-500" />,
      description: "Skills for your goals",
      color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    },
    coursesAndTrainings: {
      title: "Courses and Trainings",
      icon: <BookOpen className="h-4 w-4 text-violet-500" />,
      description: "Learning opportunities",
      color:
        "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    },
    strategies: {
      title: "Strategies",
      icon: <Lightbulb className="h-4 w-4 text-yellow-500" />,
      description: "Your action plans",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    shortTermGoals: {
      title: "Short-term Goals",
      icon: <Target className="h-4 w-4 text-green-500" />,
      description: "Immediate objectives",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
  };

  // Prepare category lists for display
  const sections = Object.entries(categories).map(([key, info]) => ({
    key,
    ...info,
    data: personalDiscovery[key],
  }));

  // Handle exporting data
  const handleExport = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(personalDiscovery, null, 2));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "personal_discovery.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      toast({
        title: "Export Successful",
        description: "Your personal discovery data has been exported.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(personalDiscovery, null, 2));
      setIsShareDialogOpen(false);
      toast({
        title: "Copied to Clipboard",
        description:
          "Your personal discovery data has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy data to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              Personal Discovery
            </CardTitle>
            <CardDescription>
              Your self-assessment using the 4W Framework
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Personal Discovery</DialogTitle>
                  <DialogDescription>
                    Choose how you want to share your personal discovery data
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <Button onClick={handleExport} className="flex justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button onClick={handlePrint} className="flex justify-start">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Discovery
                  </Button>
                  <Button
                    onClick={handleCopyToClipboard}
                    className="flex justify-start"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                  <Button asChild className="flex justify-start">
                    <Link href="/dashboard/personal-discovery/start">
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Discovery
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button asChild>
              <Link href="/dashboard/personal-discovery/start">Edit</Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
            <TabsTrigger value="aspirations">Aspirations</TabsTrigger>
            <TabsTrigger value="career">Career Planning</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["strengths", "weaknesses", "opportunities", "threats"].map(
                (category) => {
                  const { title, icon, description, color } =
                    categories[category];
                  const data = personalDiscovery[category] || [];
                  return (
                    <Card key={category} className="overflow-hidden">
                      <CardHeader
                        className={`pb-3 ${color
                          .split(" ")
                          .slice(0, 2)
                          .join(" ")} bg-opacity-40`}
                      >
                        <CardTitle className="text-base flex items-center">
                          {icon}
                          <span className="ml-2">{title}</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 pb-3 h-48 overflow-y-auto">
                        {Array.isArray(data) && data.length > 0 ? (
                          <ul className="space-y-1">
                            {data.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-sm flex items-start"
                              >
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 mr-2 flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No data provided
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Target className="mr-2 h-4 w-4 text-blue-500" />
                  Key Aspirations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Career Aspirations Summary */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                      Career Aspirations
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
                      {personalDiscovery.careerAspirations &&
                      Array.isArray(personalDiscovery.careerAspirations) &&
                      personalDiscovery.careerAspirations.length > 0 ? (
                        <p>
                          {Array.isArray(personalDiscovery.careerAspirations)
                            ? personalDiscovery.careerAspirations[0]
                            : personalDiscovery.careerAspirations}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No data provided
                        </p>
                      )}
                    </div>

                    {/* Desired Position */}
                    <h4 className="text-xs font-medium mt-3 mb-1">
                      Desired Positions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {personalDiscovery.desiredPosition &&
                      personalDiscovery.desiredPosition.length > 0 ? (
                        personalDiscovery.desiredPosition.map(
                          (position, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {position}
                            </Badge>
                          )
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No positions specified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial/Business Aspirations */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                      Financial/Business Goals
                    </h3>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded text-sm">
                      {personalDiscovery.financialBusinessAspirations &&
                      Array.isArray(
                        personalDiscovery.financialBusinessAspirations
                      ) &&
                      personalDiscovery.financialBusinessAspirations.length >
                        0 ? (
                        <p>
                          {Array.isArray(
                            personalDiscovery.financialBusinessAspirations
                          )
                            ? personalDiscovery.financialBusinessAspirations[0]
                            : personalDiscovery.financialBusinessAspirations}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No data provided
                        </p>
                      )}
                    </div>

                    {/* Short Term Goals */}
                    <h4 className="text-xs font-medium mt-3 mb-1">
                      Short-term Goals
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {personalDiscovery.shortTermGoals &&
                      personalDiscovery.shortTermGoals.length > 0 ? (
                        personalDiscovery.shortTermGoals
                          .slice(0, 3)
                          .map((goal, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {goal}
                            </Badge>
                          ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No goals specified
                        </span>
                      )}
                      {personalDiscovery.shortTermGoals &&
                        personalDiscovery.shortTermGoals.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{personalDiscovery.shortTermGoals.length - 3} more
                          </Badge>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 pb-3">
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <Link href="#" onClick={() => setActiveTab("aspirations")}>
                    View All Aspirations
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Strategic Alignment */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Strategic Development
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Required Skills */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalDiscovery.requiredSkills &&
                      personalDiscovery.requiredSkills.length > 0 ? (
                        personalDiscovery.requiredSkills.map((skill, idx) => (
                          <Badge key={idx} className="text-xs">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          No skills specified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Strategies */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Target className="h-4 w-4 mr-2 text-indigo-600" />
                      Key Strategies
                    </h3>
                    <ul className="space-y-1">
                      {personalDiscovery.strategies &&
                      personalDiscovery.strategies.length > 0 ? (
                        personalDiscovery.strategies
                          .slice(0, 3)
                          .map((strategy, idx) => (
                            <li key={idx} className="text-sm flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0"></span>
                              {strategy}
                            </li>
                          ))
                      ) : (
                        <li className="text-sm text-muted-foreground italic">
                          No strategies defined
                        </li>
                      )}
                      {personalDiscovery.strategies &&
                        personalDiscovery.strategies.length > 3 && (
                          <li className="text-xs text-muted-foreground italic">
                            +{personalDiscovery.strategies.length - 3} more
                            strategies...
                          </li>
                        )}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 pb-3">
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <Link href="#" onClick={() => setActiveTab("career")}>
                    View Career Planning
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* SWOT Analysis Tab */}
          <TabsContent value="swot">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  SWOT Analysis
                </CardTitle>
                <CardDescription>
                  A comprehensive analysis of your Strengths, Weaknesses,
                  Opportunities, and Threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-3">
                      <CardTitle className="text-base text-green-700 dark:text-green-300 flex items-center">
                        <Star className="mr-2 h-4 w-4" />
                        Strengths
                      </CardTitle>
                      <CardDescription className="text-green-600/80 dark:text-green-400/80">
                        Your core capabilities and assets
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {personalDiscovery.strengths &&
                      personalDiscovery.strengths.length > 0 ? (
                        <ul className="space-y-2">
                          {personalDiscovery.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No strengths listed
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Weaknesses */}
                  <Card className="border-red-200 dark:border-red-800">
                    <CardHeader className="bg-red-50 dark:bg-red-900/20 pb-3">
                      <CardTitle className="text-base text-red-700 dark:text-red-300 flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Weaknesses
                      </CardTitle>
                      <CardDescription className="text-red-600/80 dark:text-red-400/80">
                        Areas for improvement
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {personalDiscovery.weaknesses &&
                      personalDiscovery.weaknesses.length > 0 ? (
                        <ul className="space-y-2">
                          {personalDiscovery.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No weaknesses listed
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Opportunities */}
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-3">
                      <CardTitle className="text-base text-blue-700 dark:text-blue-300 flex items-center">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Opportunities
                      </CardTitle>
                      <CardDescription className="text-blue-600/80 dark:text-blue-400/80">
                        External factors you can leverage
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {personalDiscovery.opportunities &&
                      personalDiscovery.opportunities.length > 0 ? (
                        <ul className="space-y-2">
                          {personalDiscovery.opportunities.map(
                            (opportunity, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                                <span>{opportunity}</span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No opportunities listed
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Threats */}
                  <Card className="border-orange-200 dark:border-orange-800">
                    <CardHeader className="bg-orange-50 dark:bg-orange-900/20 pb-3">
                      <CardTitle className="text-base text-orange-700 dark:text-orange-300 flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Threats
                      </CardTitle>
                      <CardDescription className="text-orange-600/80 dark:text-orange-400/80">
                        External challenges to be aware of
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {personalDiscovery.threats &&
                      personalDiscovery.threats.length > 0 ? (
                        <ul className="space-y-2">
                          {personalDiscovery.threats.map((threat, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                              <span>{threat}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No threats listed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Achievements */}
                <Card className="mt-6 border-purple-200 dark:border-purple-800">
                  <CardHeader className="bg-purple-50 dark:bg-purple-900/20 pb-3">
                    <CardTitle className="text-base text-purple-700 dark:text-purple-300 flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      Achievements
                    </CardTitle>
                    <CardDescription className="text-purple-600/80 dark:text-purple-400/80">
                      Your accomplishments and successes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {personalDiscovery.achievements &&
                    personalDiscovery.achievements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {personalDiscovery.achievements.map(
                          (achievement, idx) => (
                            <div
                              key={idx}
                              className="bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-md"
                            >
                              <p className="text-sm">{achievement}</p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No achievements listed
                      </p>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aspirations Tab */}
          <TabsContent value="aspirations">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  Life Aspirations
                </CardTitle>
                <CardDescription>
                  Your goals and aspirations across different aspects of life
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Family Aspirations */}
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Home className="mr-2 h-4 w-4 text-green-600" />
                    Family Aspirations
                  </h3>
                  <Card>
                    <CardContent className="py-4">
                      {personalDiscovery.familyAspirations ? (
                        <div className="prose dark:prose-invert max-w-none">
                          {Array.isArray(
                            personalDiscovery.familyAspirations
                          ) ? (
                            <ul className="space-y-2">
                              {personalDiscovery.familyAspirations.map(
                                (item, idx) => (
                                  <li key={idx}>{item}</li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>{personalDiscovery.familyAspirations}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No family aspirations provided
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Career Aspirations */}
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-blue-600" />
                    Career Aspirations
                  </h3>
                  <Card>
                    <CardContent className="py-4">
                      {personalDiscovery.careerAspirations ? (
                        <div className="prose dark:prose-invert max-w-none">
                          {Array.isArray(
                            personalDiscovery.careerAspirations
                          ) ? (
                            <ul className="space-y-2">
                              {personalDiscovery.careerAspirations.map(
                                (item, idx) => (
                                  <li key={idx}>{item}</li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>{personalDiscovery.careerAspirations}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No career aspirations provided
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Financial/Business Aspirations */}
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-emerald-600" />
                    Financial/Business Aspirations
                  </h3>
                  <Card>
                    <CardContent className="py-4">
                      {personalDiscovery.financialBusinessAspirations ? (
                        <div className="prose dark:prose-invert max-w-none">
                          {Array.isArray(
                            personalDiscovery.financialBusinessAspirations
                          ) ? (
                            <ul className="space-y-2">
                              {personalDiscovery.financialBusinessAspirations.map(
                                (item, idx) => (
                                  <li key={idx}>{item}</li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>
                              {personalDiscovery.financialBusinessAspirations}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No financial/business aspirations provided
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Social Aspirations */}
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Users className="mr-2 h-4 w-4 text-indigo-600" />
                    Social Aspirations
                  </h3>
                  <Card>
                    <CardContent className="py-4">
                      {personalDiscovery.socialAspirations ? (
                        <div className="prose dark:prose-invert max-w-none">
                          {Array.isArray(
                            personalDiscovery.socialAspirations
                          ) ? (
                            <ul className="space-y-2">
                              {personalDiscovery.socialAspirations.map(
                                (item, idx) => (
                                  <li key={idx}>{item}</li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>{personalDiscovery.socialAspirations}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No social aspirations provided
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Planning Tab */}
          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                  Career Planning
                </CardTitle>
                <CardDescription>
                  Your career development roadmap and strategic planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Desired Positions */}
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Target className="mr-2 h-4 w-4 text-blue-600" />
                    Desired Positions
                  </h3>
                  <Card>
                    <CardContent className="py-4">
                      {personalDiscovery.desiredPosition &&
                      personalDiscovery.desiredPosition.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {personalDiscovery.desiredPosition.map(
                            (position, idx) => (
                              <div
                                key={idx}
                                className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-md"
                              >
                                <p className="text-sm font-medium">
                                  {position}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No desired positions listed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4 text-green-600" />
                    Required Skills
                  </h3>
                  <Card>
                    <CardContent className="py-4">
                      {personalDiscovery.requiredSkills &&
                      personalDiscovery.requiredSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {personalDiscovery.requiredSkills.map(
                            (skill, idx) => (
                              <Badge
                                key={idx}
                                className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40"
                              >
                                {skill}
                              </Badge>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No required skills listed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Courses and Trainings */}
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                    Courses and Trainings
                  </h3>
                  <Card>
                    <CardContent className="py-4">
                      {personalDiscovery.coursesAndTrainings &&
                      personalDiscovery.coursesAndTrainings.length > 0 ? (
                        <ul className="space-y-2">
                          {personalDiscovery.coursesAndTrainings.map(
                            (course, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                                <span>{course}</span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No courses or trainings listed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Strategies and Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strategies */}
                  <div>
                    <h3 className="text-base font-medium mb-2 flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4 text-amber-600" />
                      Strategies
                    </h3>
                    <Card>
                      <CardContent className="py-4">
                        {personalDiscovery.strategies &&
                        personalDiscovery.strategies.length > 0 ? (
                          <ul className="space-y-2">
                            {personalDiscovery.strategies.map(
                              (strategy, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 mr-2"></span>
                                  <span>{strategy}</span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground italic">
                            No strategies listed
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Short-term Goals */}
                  <div>
                    <h3 className="text-base font-medium mb-2 flex items-center">
                      <Target className="mr-2 h-4 w-4 text-blue-600" />
                      Short-term Goals
                    </h3>
                    <Card>
                      <CardContent className="py-4">
                        {personalDiscovery.shortTermGoals &&
                        personalDiscovery.shortTermGoals.length > 0 ? (
                          <ul className="space-y-2">
                            {personalDiscovery.shortTermGoals.map(
                              (goal, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                                  <span>{goal}</span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground italic">
                            No short-term goals listed
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("overview")}
                >
                  Back to Overview
                </Button>
                <Button asChild>
                  <Link href="/book-session">
                    Book a Mentorship Session
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Use this personal discovery to align your career goals and personal
          aspirations
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/cv-alignment">
              Align CV with Discovery
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/personal-discovery/start">
              Edit Discovery
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
