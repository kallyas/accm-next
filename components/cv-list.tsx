"use client";

import { useState, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Trash2,
  X,
  FileText,
  BarChart2,
  ListChecks,
  Tag,
  Award,
  Download,
  Layers,
  Eye,
  ChevronRight,
  Clock,
  Info,
  Calendar,
  Filter,
  Search,
  PlusCircle,
  ArrowUpDown,
  History,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getR2Url } from "@/lib/cloudflare-r2";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

// Types matching our enhanced API response
interface SkillMatch {
  term: string;
  count: number;
  category: string;
  weight: number;
}

interface SectionAnalysis {
  name: string;
  score: number;
  issues: string[];
  recommendations: string[];
  wordCount: number;
}

interface CVAnalysisResult {
  overallScore: number;
  sections: string[];
  issues: string[];
  recommendations: string[];
  details: {
    sectionAnalysis: SectionAnalysis[];
    keywordAnalysis: {
      found: SkillMatch[];
      missing: SkillMatch[];
      coverage: Record<string, number>;
    };
    actionVerbCount: number;
    contentLength: number;
    wordCount: number;
  };
}

interface CV {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  analyzedAt?: string;
  analysisResult: string | null;
}

// Define sorting and filtering types
type SortOption = "newest" | "oldest" | "score-high" | "score-low" | "name";
type ViewMode = "grid" | "list";
type FilterOption =
  | "all"
  | "analyzed"
  | "unanalyzed"
  | "high-score"
  | "needs-improvement";

// Helper functions
function getSectionTitle(sectionKey: string): string {
  const titles: Record<string, string> = {
    summary: "Professional Summary",
    contact: "Contact Information",
    skills: "Skills & Expertise",
    experience: "Work Experience",
    education: "Education",
    certifications: "Certifications",
    projects: "Projects",
    languages: "Languages",
    references: "References",
    achievements: "Achievements",
    volunteer: "Volunteer Experience",
  };

  return (
    titles[sectionKey] ||
    sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  );
}

function getScoreColor(score: number): string {
  if (score >= 80)
    return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
  if (score >= 60)
    return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
}

function getScoreCircleClass(score: number): string {
  if (score >= 80)
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
  if (score >= 60)
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
}

// if there are "," in the text, keep them, replace _ with " "
function normalizeText(text: string): string {
  return text
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z]),([a-zA-Z])/g, "$1,$2");
}

export function CVList({ initialCvs }: { initialCvs: CV[] }) {
  // State
  const [cvs, setCvs] = useState<CV[]>(initialCvs);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Parse analysis result only when a CV is selected
  const analysisResult: CVAnalysisResult | null = selectedCV?.analysisResult
    ? JSON.parse(selectedCV.analysisResult)
    : null;

  // Filter, sort, and search CVs
  const filteredCVs = useMemo(() => {
    // First filter by search query
    let result = cvs.filter((cv) =>
      cv.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Then apply filter option
    switch (filterOption) {
      case "analyzed":
        result = result.filter((cv) => cv.analysisResult !== null);
        break;
      case "unanalyzed":
        result = result.filter((cv) => cv.analysisResult === null);
        break;
      case "high-score":
        result = result.filter((cv) => {
          if (!cv.analysisResult) return false;
          const analysis = JSON.parse(cv.analysisResult);
          return analysis.overallScore >= 80;
        });
        break;
      case "needs-improvement":
        result = result.filter((cv) => {
          if (!cv.analysisResult) return false;
          const analysis = JSON.parse(cv.analysisResult);
          return analysis.overallScore < 60;
        });
        break;
      default:
        // "all" - no additional filtering
        break;
    }

    // Then sort
    return result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          );
        case "name":
          return a.fileName.localeCompare(b.fileName);
        case "score-high":
          const scoreA = a.analysisResult
            ? JSON.parse(a.analysisResult).overallScore
            : 0;
          const scoreB = b.analysisResult
            ? JSON.parse(b.analysisResult).overallScore
            : 0;
          return scoreB - scoreA;
        case "score-low":
          const scoreC = a.analysisResult
            ? JSON.parse(a.analysisResult).overallScore
            : 0;
          const scoreD = b.analysisResult
            ? JSON.parse(b.analysisResult).overallScore
            : 0;
          return scoreC - scoreD;
        default:
          return 0;
      }
    });
  }, [cvs, searchQuery, sortOption, filterOption]);

  const handleDelete = async (cvId: string) => {
    setCvToDelete(cvId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!cvToDelete) return;

    try {
      const response = await fetch(`/api/cv/${cvToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCvs(cvs.filter((cv) => cv.id !== cvToDelete));
        toast({
          title: "CV Deleted",
          description: "Your CV has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete CV");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCvToDelete(null);
    }
  };

  const handleDownload = async (cv: CV) => {
    try {
      // Get the actual download URL
      const downloadUrl = await getR2Url(cv.fileUrl);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = cv.fileName;
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `Downloading ${cv.fileName}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate category coverage data for visualization
  const getCategoryCoverage = () => {
    if (!analysisResult?.details?.keywordAnalysis?.coverage) return [];

    const coverage = analysisResult.details.keywordAnalysis.coverage;
    return Object.entries(coverage).map(([category, value]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      coverage: Math.round(value * 100),
      class:
        value >= 0.7
          ? "bg-green-500"
          : value >= 0.4
          ? "bg-yellow-500"
          : "bg-red-500",
    }));
  };

  return (
    <div className="space-y-6">
      {cvs.length === 0 ? (
        <div className="h-60 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/30 p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No CVs Uploaded</h3>
          <p className="text-muted-foreground mb-4">
            Start by uploading your CV for professional analysis and improvement
            suggestions.
          </p>
          <Button asChild>
            <Link href="/cv-alignment">
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload Your First CV
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Filters and sorting */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search CVs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex gap-2">
                  {/* Filter by status */}
                  <Select
                    value={filterOption}
                    onValueChange={(value: FilterOption) =>
                      setFilterOption(value)
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All CVs</SelectItem>
                      <SelectItem value="analyzed">Analyzed Only</SelectItem>
                      <SelectItem value="unanalyzed">
                        Not Yet Analyzed
                      </SelectItem>
                      <SelectItem value="high-score">
                        High Score (80+)
                      </SelectItem>
                      <SelectItem value="needs-improvement">
                        Needs Improvement
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort options */}
                  <Select
                    value={sortOption}
                    onValueChange={(value: SortOption) => setSortOption(value)}
                  >
                    <SelectTrigger className="w-[160px]">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name">File Name</SelectItem>
                      <SelectItem value="score-high">Highest Score</SelectItem>
                      <SelectItem value="score-low">Lowest Score</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View mode toggle */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setViewMode(viewMode === "grid" ? "list" : "grid")
                          }
                        >
                          {viewMode === "grid" ? (
                            <ListIcon className="h-4 w-4" />
                          ) : (
                            <LayoutGrid className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Switch to {viewMode === "grid" ? "list" : "grid"} view
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Filter indicators */}
              {(searchQuery || filterOption !== "all") && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Showing {filteredCVs.length} of {cvs.length} CVs
                  </span>
                  {searchQuery && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Search: {searchQuery}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setSearchQuery("")}
                      />
                    </Badge>
                  )}
                  {filterOption !== "all" && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Filter: {filterOption.replace(/-/g, " ")}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setFilterOption("all")}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grid/List of CVs */}
          {filteredCVs.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No matching CVs</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterOption("all");
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCVs.map((cv) => {
                // Parse this CV's analysis result
                const analysis = cv.analysisResult
                  ? (JSON.parse(
                      cv.analysisResult as string
                    ) as CVAnalysisResult)
                  : null;
                const score = analysis?.overallScore || 0;
                const scoreClass = getScoreCircleClass(score);
                const truncatedName =
                  cv.fileName.length > 24
                    ? `${cv.fileName.slice(0, 24)}...`
                    : cv.fileName;

                return (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="truncate" title={cv.fileName}>
                              {truncatedName}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <History className="h-3 w-3" />
                              {formatDistanceToNow(new Date(cv.uploadedAt), {
                                addSuffix: true,
                              })}
                            </CardDescription>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(cv.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete CV</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-4 flex-1">
                        {analysis ? (
                          <div className="space-y-4">
                            {/* Score display */}
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center border ${scoreClass}`}
                              >
                                <span className="text-xl font-bold">
                                  {score}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  Overall Score
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {score >= 80
                                    ? "Excellent CV"
                                    : score >= 60
                                    ? "Good with room for improvement"
                                    : "Needs significant improvement"}
                                </p>
                              </div>
                            </div>

                            {/* Key metrics */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Issues
                                </span>
                                <Badge
                                  variant={
                                    analysis.issues.length > 0
                                      ? "outline"
                                      : "secondary"
                                  }
                                >
                                  {analysis.issues.length}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Word Count
                                </span>
                                <Badge variant="outline">
                                  {analysis.details?.wordCount || "N/A"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 text-center space-y-2">
                            <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <p className="text-sm font-medium">
                              Not Yet Analyzed
                            </p>
                            <p className="text-xs text-muted-foreground">
                              This CV needs to be analyzed to get insights
                            </p>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="pt-0 flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto flex-1"
                          onClick={() => handleDownload(cv)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                        </Button>

                        {analysis ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full sm:w-auto flex-1"
                                onClick={() => {
                                  setSelectedCV(cv);
                                  setActiveTab("overview");
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Analysis
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        ) : (
                          <Button
                            className="w-full sm:w-auto flex-1"
                            variant="secondary"
                            asChild
                          >
                            <Link href="/cv-alignment">
                              <BarChart2 className="h-4 w-4 mr-2" />
                              Analyze Now
                            </Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCVs.map((cv) => {
                // Parse this CV's analysis result
                const analysis = cv.analysisResult
                  ? (JSON.parse(
                      cv.analysisResult as string
                    ) as CVAnalysisResult)
                  : null;
                const score = analysis?.overallScore || 0;
                const scoreClass = getScoreColor(score);

                return (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden hover:bg-muted/20 transition-colors">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row items-stretch">
                          {/* File info */}
                          <div className="p-4 flex-grow flex justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h3 className="font-medium" title={cv.fileName}>
                                  {cv.fileName.length > 40
                                    ? `${cv.fileName.slice(0, 40)}...`
                                    : cv.fileName}
                                </h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(
                                    new Date(cv.uploadedAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Score badge for list view */}
                            {analysis && (
                              <div className="hidden sm:flex items-center gap-2">
                                <Badge className={scoreClass}>
                                  Score: {score}
                                </Badge>
                                <Badge variant="outline">
                                  {analysis.details.wordCount} words
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* List view score display for mobile */}
                          {analysis && (
                            <div className="sm:hidden px-4 pb-2 flex items-center gap-2">
                              <Badge className={scoreClass}>
                                Score: {score}
                              </Badge>
                              <Badge variant="outline">
                                {analysis.details.wordCount} words
                              </Badge>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex sm:flex-col justify-end border-l border-border/50 divide-x sm:divide-x-0 sm:divide-y divide-border/50">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-none h-12 px-4"
                              onClick={() => handleDownload(cv)}
                            >
                              <Download className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>

                            {analysis ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-none h-12 px-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                                    onClick={() => {
                                      setSelectedCV(cv);
                                      setActiveTab("overview");
                                    }}
                                  >
                                    <Eye className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                      View Analysis
                                    </span>
                                  </Button>
                                </DialogTrigger>
                              </Dialog>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-none h-12 px-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-900/20"
                                asChild
                              >
                                <Link href="/cv-alignment">
                                  <BarChart2 className="h-4 w-4 sm:mr-2" />
                                  <span className="hidden sm:inline">
                                    Analyze
                                  </span>
                                </Link>
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-none h-12 px-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                              onClick={() => handleDelete(cv.id)}
                            >
                              <Trash2 className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Analysis Dialog */}
      {selectedCV && (
        <Dialog
          open={!!selectedCV}
          onOpenChange={(open) => !open && setSelectedCV(null)}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                CV Analysis Report
              </DialogTitle>
              <DialogDescription>
                Comprehensive analysis for{" "}
                <span className="font-medium">{selectedCV.fileName}</span>
              </DialogDescription>
            </DialogHeader>

            {analysisResult ? (
              <div className="flex-1 overflow-hidden">
                <Tabs
                  defaultValue="overview"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-2"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sections">Sections</TabsTrigger>
                    <TabsTrigger value="keywords">Keywords</TabsTrigger>
                    <TabsTrigger value="recommendations">
                      Improvements
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent
                    value="overview"
                    className="overflow-y-auto max-h-[65vh]"
                  >
                    <div className="space-y-6">
                      {/* Score Card */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="col-span-1 md:col-span-1">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground text-center">
                              Overall Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-4">
                            <div className="flex items-center justify-center">
                              <div
                                className={`
                                w-32 h-32 rounded-full flex items-center justify-center border-4 ${getScoreCircleClass(
                                  analysisResult.overallScore
                                )}
                                `}
                              >
                                <span className="text-4xl font-bold">
                                  {analysisResult.overallScore}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 pb-4 text-center">
                            <p className="text-sm text-muted-foreground mx-auto">
                              {analysisResult.overallScore >= 80
                                ? "Excellent CV"
                                : analysisResult.overallScore >= 60
                                ? "Good CV with room for improvement"
                                : "Significant improvements needed"}
                            </p>
                          </CardFooter>
                        </Card>

                        <Card className="col-span-1 md:col-span-2">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">
                              Key Metrics
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      Word Count
                                    </span>
                                    <span className="text-sm">
                                      {analysisResult.details.wordCount}
                                    </span>
                                  </div>
                                  <Progress
                                    value={Math.min(
                                      analysisResult.details.wordCount / 10,
                                      100
                                    )}
                                    className="h-2"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {analysisResult.details.wordCount < 300
                                      ? "Consider adding more content"
                                      : analysisResult.details.wordCount > 800
                                      ? "Consider condensing your CV"
                                      : "Good length"}
                                  </p>
                                </div>

                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      Action Verbs
                                    </span>
                                    <span className="text-sm">
                                      {analysisResult.details.actionVerbCount}
                                    </span>
                                  </div>
                                  <Progress
                                    value={Math.min(
                                      analysisResult.details.actionVerbCount *
                                        10,
                                      100
                                    )}
                                    className="h-2"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {analysisResult.details.actionVerbCount < 5
                                      ? "Add more action verbs to strengthen your CV"
                                      : "Good use of action verbs"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      Sections
                                    </span>
                                    <span className="text-sm">
                                      {analysisResult.sections.length}/10
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      (analysisResult.sections.length / 10) *
                                      100
                                    }
                                    className="h-2"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {analysisResult.sections.length < 5
                                      ? "Add more sections to your CV"
                                      : "Good section coverage"}
                                  </p>
                                </div>

                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      Keywords
                                    </span>
                                    <span className="text-sm">
                                      {
                                        analysisResult.details.keywordAnalysis
                                          .found.length
                                      }{" "}
                                      found
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      (analysisResult.details.keywordAnalysis
                                        .found.length /
                                        (analysisResult.details.keywordAnalysis
                                          .found.length +
                                          analysisResult.details.keywordAnalysis
                                            .missing.length)) *
                                      100
                                    }
                                    className="h-2"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {analysisResult.details.keywordAnalysis
                                      .found.length < 5
                                      ? "Add more industry-relevant keywords"
                                      : "Good keyword usage"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Issues and Recommendations overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Issues */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center">
                              <AlertCircle
                                className="mr-2 text-red-500"
                                size={16}
                              />
                              Top Issues ({analysisResult.issues.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="overflow-y-auto max-h-[200px]">
                              {analysisResult.issues.length > 0 ? (
                                <ul className="space-y-2">
                                  {analysisResult.issues
                                    .slice(0, 5)
                                    .map((issue: string, index: number) => (
                                      <li
                                        key={index}
                                        className="flex items-start text-red-600 dark:text-red-400 mb-2"
                                      >
                                        <X className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">{issue}</span>
                                      </li>
                                    ))}
                                  {analysisResult.issues.length > 5 && (
                                    <Button
                                      variant="ghost"
                                      className="w-full text-sm mt-2"
                                      onClick={() =>
                                        setActiveTab("recommendations")
                                      }
                                    >
                                      View all {analysisResult.issues.length}{" "}
                                      issues
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                  )}
                                </ul>
                              ) : (
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  No major issues found!
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center">
                              <Lightbulb
                                className="mr-2 text-yellow-500"
                                size={16}
                              />
                              Improvement Suggestions (
                              {analysisResult.recommendations.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="overflow-y-auto max-h-[200px]">
                              {analysisResult.recommendations.length > 0 ? (
                                <ul className="space-y-2">
                                  {analysisResult.recommendations
                                    .slice(0, 5)
                                    .map(
                                      (
                                        recommendation: string,
                                        index: number
                                      ) => (
                                        <li
                                          key={index}
                                          className="flex items-start text-blue-600 dark:text-blue-400 mb-2"
                                        >
                                          <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                                          <span className="text-sm">
                                            {normalizeText(
                                              recommendation
                                            ).replace(/_/g, " ")}
                                          </span>
                                        </li>
                                      )
                                    )}
                                  {analysisResult.recommendations.length >
                                    5 && (
                                    <Button
                                      variant="ghost"
                                      className="w-full text-sm mt-2"
                                      onClick={() =>
                                        setActiveTab("recommendations")
                                      }
                                    >
                                      View all{" "}
                                      {analysisResult.recommendations.length}{" "}
                                      suggestions
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                  )}
                                </ul>
                              ) : (
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                  <Award className="mr-2 h-4 w-4" />
                                  Your CV looks excellent!
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Categories overview */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center">
                            <Tag className="mr-2 text-blue-500" size={16} />
                            Industry Keyword Coverage
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {getCategoryCoverage().map((category, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {normalizeText(
                                      category.category
                                    ).replace(/_/g, " ")}
                                  </span>
                                  <span className="text-sm">
                                    {category.coverage}%
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${category.class}`}
                                    style={{ width: `${category.coverage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button
                            variant="ghost"
                            className="w-full text-sm mt-6"
                            onClick={() => setActiveTab("keywords")}
                          >
                            View detailed keyword analysis
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                          {/* add something to push content up */}
                          <div className="h-4"></div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Sections Tab */}
                  <TabsContent
                    value="sections"
                    className="overflow-y-auto max-h-[65vh]"
                  >
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {analysisResult.sections.map((section, index) => (
                          <Badge key={index} variant="outline">
                            {getSectionTitle(section)}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-4">
                        {analysisResult.details.sectionAnalysis.map(
                          (section, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-base font-medium">
                                    {getSectionTitle(section.name)}
                                  </CardTitle>
                                  <Badge
                                    className={getScoreColor(section.score)}
                                  >
                                    {section.score}/100
                                  </Badge>
                                </div>
                                <CardDescription>
                                  {section.wordCount} words
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-2">
                                {section.issues.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="text-sm font-medium mb-2 flex items-center">
                                      <X className="mr-2 h-4 w-4 text-red-500" />
                                      Issues
                                    </h4>
                                    <ul className="pl-6 space-y-1">
                                      {section.issues.map((issue, idx) => (
                                        <li
                                          key={idx}
                                          className="text-sm text-red-600 dark:text-red-400 list-disc"
                                        >
                                          {issue}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {section.recommendations.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2 flex items-center">
                                      <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                                      Recommendations
                                    </h4>
                                    <ul className="pl-6 space-y-1">
                                      {section.recommendations.map(
                                        (recommendation, idx) => (
                                          <li
                                            key={idx}
                                            className="text-sm text-blue-600 dark:text-blue-400 list-disc"
                                          >
                                            {recommendation}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {section.issues.length === 0 &&
                                  section.recommendations.length === 0 && (
                                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      This section looks good!
                                    </p>
                                  )}
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>

                      {/* Missing Sections */}
                      {analysisResult.sections.length < 6 && (
                        <Card className="border-dashed border-orange-300 dark:border-orange-700">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center">
                              <AlertCircle
                                className="mr-2 text-orange-500"
                                size={16}
                              />
                              Consider Adding These Sections
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {[
                                "summary",
                                "skills",
                                "experience",
                                "education",
                                "projects",
                                "certifications",
                              ]
                                .filter(
                                  (section) =>
                                    !analysisResult.sections.includes(section)
                                )
                                .map((section, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center"
                                  >
                                    <div className="w-3 h-3 bg-orange-200 dark:bg-orange-900 rounded-full mr-2"></div>
                                    <span className="text-sm">
                                      {getSectionTitle(section)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      <div className="h-4"></div>
                    </div>
                  </TabsContent>

                  {/* Keywords Tab */}
                  <TabsContent
                    value="keywords"
                    className="overflow-y-auto max-h-[65vh]"
                  >
                    <div className="space-y-6">
                      {/* Category Coverage */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center">
                            <BarChart2
                              className="mr-2 text-blue-500"
                              size={16}
                            />
                            Industry Category Coverage
                          </CardTitle>
                          <CardDescription>
                            How well your CV covers important industry skill
                            categories
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            {getCategoryCoverage().map((category, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {normalizeText(
                                      category.category
                                    ).replace(/_/g, " ")}
                                  </span>
                                  <span className="text-sm">
                                    {category.coverage}%
                                  </span>
                                </div>
                                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${category.class}`}
                                    style={{ width: `${category.coverage}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {category.coverage >= 70
                                    ? "Excellent coverage"
                                    : category.coverage >= 40
                                    ? "Good coverage, but could be improved"
                                    : "Needs significant improvement"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Found Keywords */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center">
                            <CheckCircle2
                              className="mr-2 text-green-500"
                              size={16}
                            />
                            Keywords Found in Your CV
                          </CardTitle>
                          <CardDescription>
                            Industry-relevant keywords detected in your CV
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {analysisResult.details.keywordAnalysis.found.length >
                          0 ? (
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.details.keywordAnalysis.found.map(
                                (keyword, index) => (
                                  <div
                                    key={index}
                                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm flex items-center"
                                  >
                                    <span className="font-medium capitalize">
                                      {keyword.term}
                                    </span>
                                    {keyword.count > 1 && (
                                      <span className="ml-1 text-xs bg-green-200 dark:bg-green-800 rounded-full px-1.5">
                                        {keyword.count}×
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No industry-relevant keywords found. Consider
                              adding keywords related to your field.
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Missing Keywords */}
                      {analysisResult.details.keywordAnalysis.missing.length >
                        0 && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center">
                              <X className="mr-2 text-red-500" size={16} />
                              Recommended Keywords
                            </CardTitle>
                            <CardDescription>
                              Consider adding these keywords to improve your CV
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.details.keywordAnalysis.missing.map(
                                (keyword, index) => (
                                  <div
                                    key={index}
                                    className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm flex items-center"
                                  >
                                    <span className="font-medium capitalize">
                                      {keyword.term}
                                    </span>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="ml-1 text-xs bg-white dark:bg-red-800 rounded-full p-0.5">
                                            <Info className="h-3 w-3" />
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">
                                            Category: {keyword.category}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Action Verbs */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center">
                            <Layers className="mr-2 text-blue-500" size={16} />
                            Action Verbs
                          </CardTitle>
                          <CardDescription>
                            Action verbs help highlight your accomplishments
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className={`
                                w-16 h-16 rounded-full flex items-center justify-center
                                ${
                                  analysisResult.details.actionVerbCount >= 10
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                    : analysisResult.details.actionVerbCount >=
                                      5
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                }
                              `}
                            >
                              <span className="text-xl font-bold">
                                {analysisResult.details.actionVerbCount}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium">Action Verb Count</h4>
                              <p className="text-sm text-muted-foreground">
                                {analysisResult.details.actionVerbCount >= 10
                                  ? "Excellent use of action verbs"
                                  : analysisResult.details.actionVerbCount >= 5
                                  ? "Good start, but consider adding more"
                                  : "Add more action verbs to strengthen your CV"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">
                              Recommended Action Verbs
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "achieved",
                                "improved",
                                "developed",
                                "led",
                                "managed",
                                "created",
                                "implemented",
                                "delivered",
                                "reduced",
                                "increased",
                              ]
                                .filter(
                                  (verb) =>
                                    !analysisResult.details.actionVerbCount
                                      .toString()
                                      .includes(verb.toLowerCase())
                                )
                                .slice(0, 8)
                                .map((verb, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {verb}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                          <div className="h-4"></div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Recommendations Tab */}
                  <TabsContent
                    value="recommendations"
                    className="overflow-y-auto max-h-[65vh]"
                  >
                    <div className="space-y-6">
                      {/* Issues */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center">
                            <AlertCircle
                              className="mr-2 text-red-500"
                              size={16}
                            />
                            Identified Issues
                          </CardTitle>
                          <CardDescription>
                            Areas that need improvement in your CV
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {analysisResult.issues.length > 0 ? (
                            <ul className="space-y-3">
                              {analysisResult.issues.map((issue, index) => (
                                <li
                                  key={index}
                                  className="flex items-start text-red-600 dark:text-red-400"
                                >
                                  <X className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                                  <span className="text-sm">{issue}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              No major issues found!
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommendations */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center">
                            <Lightbulb
                              className="mr-2 text-yellow-500"
                              size={16}
                            />
                            Improvement Recommendations
                          </CardTitle>
                          <CardDescription>
                            Actionable steps to improve your CV
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {analysisResult.recommendations.length > 0 ? (
                            <ul className="space-y-3">
                              {analysisResult.recommendations.map(
                                (recommendation, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start text-blue-600 dark:text-blue-400"
                                  >
                                    <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm">
                                      {normalizeText(
                                        recommendation
                                      ).replace(/_/g, " ")}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                              <Award className="mr-2 h-4 w-4" />
                              Your CV looks excellent!
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Next Steps */}
                      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center text-blue-700 dark:text-blue-300">
                            <ListChecks
                              className="mr-2 text-blue-600 dark:text-blue-400"
                              size={16}
                            />
                            Next Steps
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ol className="space-y-3">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center mr-3 text-xs font-medium">
                                1
                              </div>
                              <div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Review all recommendations
                                </p>
                                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                                  Understand what needs to be improved
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center mr-3 text-xs font-medium">
                                2
                              </div>
                              <div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Download your CV and make the suggested
                                  improvements
                                </p>
                                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                                  Update your CV based on the analysis
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center mr-3 text-xs font-medium">
                                3
                              </div>
                              <div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Upload the revised CV for another analysis
                                </p>
                                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                                  Track your improvement over time
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center mr-3 text-xs font-medium">
                                4
                              </div>
                              <div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Book a session with one of our mentors
                                </p>
                                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                                  Get personalized guidance on your career path
                                </p>
                              </div>
                            </li>
                          </ol>

                          <div className="mt-6 flex justify-center">
                            <Button asChild>
                              <Link href="/book-session">
                                <Calendar className="mr-2 h-4 w-4" />
                                Book Mentorship Session
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <div className="h-6"></div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Analysis Not Available
                </h3>
                <p className="text-muted-foreground mb-6">
                  This CV has not been analyzed yet or the analysis failed.
                </p>
                <Button asChild>
                  <Link href="/cv-alignment">Analyze Your CV</Link>
                </Button>
              </div>
            )}

            <DialogFooter className="mt-4 border-t pt-4 flex items-center justify-between">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {selectedCV.analyzedAt
                    ? `Analyzed on ${format(
                        new Date(selectedCV.analyzedAt),
                        "PPP"
                      )}`
                    : "Not yet analyzed"}
                </span>
              </div>

              <Button
                onClick={() => handleDownload(selectedCV)}
                variant="default"
              >
                <Download className="mr-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this CV? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add floating action button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-10">
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" asChild>
          <Link href="/cv-alignment">
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Upload New CV</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
