"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Info,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Target,
  Heart,
  Save,
  Share,
  RefreshCw,
  RotateCw,
  BarChart,
  BookOpen,
  Lightbulb,
  Award,
  Clock,
  Send,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  CareerAssessmentAnswers,
  MatchResult,
  Question,
  SectionType,
} from "@/types/general";
import { generateCareerMatches, saveAssessmentResults } from "@/lib/career-map";
import { INITIAL_QUESTIONS, CAREER_QUESTIONS } from "./career-map-config";
import { motion } from "framer-motion";

interface FormErrors {
  [key: string]: string;
}

// Enhanced section interface for better navigation
interface Section {
  id: SectionType;
  title: string;
  description: string;
  icon: React.ReactNode;
  questions: Question[];
}

export function CareerMapGame() {
  const { data: session, status } = useSession();
  const [answers, setAnswers] = useState<Partial<CareerAssessmentAnswers>>({});
  const [currentSection, setCurrentSection] = useState<SectionType>("initial");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [suggestions, setSuggestions] = useState<MatchResult[] | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [saveProgress, setSaveProgress] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState<Record<SectionType, number>>({
    initial: 0,
    career: 0,
  });

  // Define sections with metadata for better UX
  const sections: Section[] = [
    {
      id: "initial",
      title: "Personal Background",
      description: "Tell us about your background, interests, and preferences",
      icon: <BookOpen className="w-5 h-5" />,
      questions: INITIAL_QUESTIONS,
    },
    {
      id: "career",
      title: "Career Aspirations",
      description: "Share your career goals and work style preferences",
      icon: <Target className="w-5 h-5" />,
      questions: CAREER_QUESTIONS,
    },
  ];

  const currentSectionData = sections.find((s) => s.id === currentSection) || sections[0];
  const currentQ = currentSectionData.questions[currentQuestion];
  const totalQuestions = INITIAL_QUESTIONS.length + CAREER_QUESTIONS.length;
  const currentOverallProgress =
    (((currentSection === "career" ? INITIAL_QUESTIONS.length : 0) + currentQuestion + 1) /
      totalQuestions) *
    100;

  // Calculate completion percentages for each section
  useEffect(() => {
    const initialAnswered = INITIAL_QUESTIONS.filter((q) => answers[q.id]).length;
    const careerAnswered = CAREER_QUESTIONS.filter((q) => answers[q.id]).length;

    setCompletionPercentage({
      initial: (initialAnswered / INITIAL_QUESTIONS.length) * 100,
      career: (careerAnswered / CAREER_QUESTIONS.length) * 100,
    });
  }, [answers]);

  // Load saved progress
  useEffect(() => {
    if (!saveProgress) return;

    const savedProgress = localStorage.getItem("careerMapProgress");
    if (savedProgress) {
      try {
        const { answers: savedAnswers, section, question } = JSON.parse(savedProgress);
        setAnswers(savedAnswers);
        setCurrentSection(section);
        setCurrentQuestion(question);
        setShowIntro(false);
      } catch (error) {
        console.error("Error loading saved progress:", error);
        localStorage.removeItem("careerMapProgress");
      }
    }
  }, [saveProgress]);

  // Save progress
  useEffect(() => {
    if (!saveProgress) return;

    localStorage.setItem(
      "careerMapProgress",
      JSON.stringify({
        answers,
        section: currentSection,
        question: currentQuestion,
      })
    );
  }, [answers, currentSection, currentQuestion, saveProgress]);

  const validateField = useCallback(
    (id: string, value: string | string[]): string | null => {
      const question = [...INITIAL_QUESTIONS, ...CAREER_QUESTIONS].find((q) => q.id === id);
      if (!question?.validation) return null;

      const { required, minLength, maxLength, pattern, maxSelections } = question.validation;

      if (required && (!value || (Array.isArray(value) && value.length === 0))) {
        return "This field is required";
      }

      if (typeof value === "string") {
        if (minLength && value.length < minLength) {
          return `Answer must be at least ${minLength} characters`;
        }

        if (maxLength && value.length > maxLength) {
          return `Answer must not exceed ${maxLength} characters`;
        }

        if (pattern && !pattern.test(value)) {
          return "Answer format is invalid";
        }
      }

      if (Array.isArray(value) && maxSelections && value.length > maxSelections) {
        return `Please select no more than ${maxSelections} options`;
      }

      return null;
    },
    []
  );

  const handleInputChange = (value: string | string[], questionId: string) => {
    const error = validateField(questionId, value);
    setFormErrors((prev) => ({
      ...prev,
      [questionId]: error || "",
    }));

    setAnswers((prev) => ({
      ...prev,
      [questionId]: Array.isArray(value) ? value.join(",") : value,
    }));
  };

  const handleNext = () => {
    const currentAnswer = answers[currentQ.id];
    const error = validateField(currentQ.id, currentAnswer || "");
    if (error) {
      setFormErrors((prev) => ({
        ...prev,
        [currentQ.id]: error,
      }));
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else if (currentSection === "initial") {
      setCurrentSection("career");
      setCurrentQuestion(0);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else if (currentSection === "career") {
      setCurrentSection("initial");
      setCurrentQuestion(INITIAL_QUESTIONS.length - 1);
    }
  };

  const handleJumpToSection = (section: SectionType, questionIndex: number = 0) => {
    setCurrentSection(section);
    setCurrentQuestion(questionIndex);
  };

  const handleSubmit = async () => {
    // Validate all answers before submission
    const allErrors: FormErrors = {};
    let hasErrors = false;

    [...INITIAL_QUESTIONS, ...CAREER_QUESTIONS].forEach((question) => {
      if (question.validation?.required) {
        const error = validateField(question.id, answers[question.id] || "");
        if (error) {
          allErrors[question.id] = error;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setFormErrors(allErrors);
      toast({
        title: "Form Validation Error",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const matches = generateCareerMatches(answers as CareerAssessmentAnswers);
      const topSuggestions = matches.slice(0, 5); // Showing more recommendations for better insights

      if ((session?.user?.id || answers.email) && saveProgress) {
        await saveAssessmentResults(
          session?.user?.id || (answers.email as string),
          answers as CareerAssessmentAnswers,
          topSuggestions
        );
        toast({
          title: "Results Saved",
          description: "Your assessment results have been saved successfully",
        });
      }

      setSuggestions(topSuggestions);
    } catch (error) {
      console.error("Error generating results:", error);
      setError("Failed to generate career suggestions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!suggestions?.[0]) return;

    const shareText = `Based on my CareerMap assessment, I'm a ${Math.round(
      suggestions[0].confidence * 100
    )}% match for ${suggestions[0].title}! Key factors: ${suggestions[0].matchingFactors
      .slice(0, 2)
      .join(", ")}. Find your career match:`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My CareerMap Result",
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Share this text with your friends!",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error sharing result",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (!suggestions) return;

    const data = {
      assessmentDate: new Date().toISOString(),
      userProfile: answers,
      careerMatches: suggestions,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "careermap-results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    toast({
      title: "Results Exported",
      description: "Your assessment results have been downloaded",
    });
  };

  const restartAssessment = () => {
    if (
      window.confirm(
        "Are you sure you want to restart? All your current progress will be lost."
      )
    ) {
      setAnswers({});
      setCurrentSection("initial");
      setCurrentQuestion(0);
      setSuggestions(null);
      setError(null);
      setShowIntro(true);
      if (saveProgress) {
        localStorage.removeItem("careerMapProgress");
      }
    }
  };

  const renderQuestionHelper = (question: Question) => {
    if (!question.helper) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-2 text-sm text-muted-foreground flex items-center cursor-help">
              <Info className="inline-block w-4 h-4 mr-1 text-brand-blue" />
              <span>Help with this question</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm p-4 bg-popover text-popover-foreground">
            <p>{question.helper}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderSelectionCount = (questionId: string, value: string) => {
    const question = [...INITIAL_QUESTIONS, ...CAREER_QUESTIONS].find((q) => q.id === questionId);

    if (!question?.validation?.maxSelections) return null;

    const currentSelections = value.split(",").filter(Boolean).length;
    const maxSelections = question.validation.maxSelections;
    
    return (
      <div className="mt-2 text-sm flex items-center">
        <span className={currentSelections === maxSelections ? "text-warning font-medium" : "text-muted-foreground"}>
          Selected: {currentSelections} / {maxSelections}
        </span>
        {currentSelections === maxSelections && (
          <Badge variant="outline" className="ml-2 bg-warning/10 text-warning border-warning/20">
            Max reached
          </Badge>
        )}
      </div>
    );
  };

  const renderFormField = () => {
    const value = answers[currentQ.id] || "";
    const error = formErrors[currentQ.id];

    switch (currentQ.type) {
      case "radio":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={value}
              onValueChange={(val) => handleInputChange(val, currentQ.id)}
              className="space-y-3"
            >
              {currentQ.options?.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {renderQuestionHelper(currentQ)}
          </div>
        );

      case "multiSelect":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQ.options?.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    value.split(",").includes(option)
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Checkbox
                    id={option}
                    checked={value.split(",").includes(option)}
                    onCheckedChange={(checked) => {
                      const currentSelections = value.split(",").filter(Boolean);
                      if (
                        checked &&
                        currentQ.validation?.maxSelections &&
                        currentSelections.length >= currentQ.validation.maxSelections
                      ) {
                        toast({
                          title: "Maximum selections reached",
                          description: `You can only select up to ${currentQ.validation.maxSelections} options`,
                          variant: "destructive",
                        });
                        return;
                      }
                      const newSelections = checked
                        ? [...currentSelections, option]
                        : currentSelections.filter((item) => item !== option);
                      handleInputChange(newSelections, currentQ.id);
                    }}
                  />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {renderSelectionCount(currentQ.id, value)}
            {renderQuestionHelper(currentQ)}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Textarea
              value={value}
              onChange={(e) => handleInputChange(e.target.value, currentQ.id)}
              placeholder={currentQ.placeholder || "Type your answer here..."}
              className={`min-h-[150px] ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {currentQ.validation?.minLength && (
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Minimum {currentQ.validation.minLength} characters
                <div className="ml-2 flex items-center">
                  <Progress
                    value={Math.min((value.length / currentQ.validation.minLength) * 100, 100)}
                    className="h-2 w-24"
                    style={{
                      "--progress-fill": value.length >= currentQ.validation.minLength 
                        ? "hsl(var(--success))" 
                        : "hsl(var(--primary))"
                    } as React.CSSProperties}
                  />
                  <span className="ml-2 text-xs">
                    {value.length}/{currentQ.validation.minLength}
                  </span>
                </div>
              </div>
            )}
            {renderQuestionHelper(currentQ)}
          </div>
        );

      case "text":
        return (
          <div className="space-y-2">
            <Input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(e.target.value, currentQ.id)}
              placeholder={currentQ.placeholder || "Type your answer here"}
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {renderQuestionHelper(currentQ)}
          </div>
        );

      default:
        return null;
    }
  };

  const renderProgressSummary = () => {
    return (
      <div className="flex flex-col space-y-4 mb-4">
        {sections.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {section.icon}
                <span className="ml-2 font-medium">{section.title}</span>
              </div>
              <span className="text-sm">
                {Math.round(completionPercentage[section.id])}% complete
              </span>
            </div>
            <Progress 
              value={completionPercentage[section.id]} 
              className="h-2"
              style={{
                "--progress-fill": completionPercentage[section.id] >= 100 
                  ? "hsl(var(--success))" 
                  : completionPercentage[section.id] > 50
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))"
              } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderCareerMatchTabs = () => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
      <Tabs
        defaultValue="0"
        value={activeTabIndex.toString()}
        onValueChange={(value) => setActiveTabIndex(parseInt(value))}
        className="w-full"
      >
        <TabsList className="w-full mb-4 flex justify-between overflow-x-auto">
          {suggestions.map((suggestion, index) => (
            <TabsTrigger
              key={suggestion.title}
              value={index.toString()}
              className="flex-1 min-w-min"
            >
              {index + 1}. {suggestion.title.split(" ")[0]}
              <Badge
                variant="outline"
                className="ml-2 bg-primary/10 border-primary/20 whitespace-nowrap"
              >
                {Math.round(suggestion.confidence * 100)}%
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {suggestions.map((suggestion, index) => (
          <TabsContent key={suggestion.title} value={index.toString()}>
            {renderCareerMatch(suggestion, index)}
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderCareerMatch = (suggestion: MatchResult, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 border-t-4" style={{ borderTopColor: getCareerColor(index) }}>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{suggestion.title}</h3>
                <Badge
                  variant="outline"
                  className="ml-2"
                  style={{
                    backgroundColor: `${getCareerColor(index)}20`,
                    borderColor: `${getCareerColor(index)}40`,
                    color: getCareerColor(index),
                  }}
                >
                  {Math.round(suggestion.confidence * 100)}% Match
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Briefcase className="w-4 h-4" />
                {suggestion.sectors.join(" • ")}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1">
                <Progress
                  value={suggestion.confidence * 100}
                  className="h-2 w-32"
                  style={{
                    backgroundColor: `${getCareerColor(index)}20`,
                    "--progress-fill": getCareerColor(index),
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">{suggestion.description}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-accent/30 border-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-blue" />
                  <h4 className="font-semibold">Education Path</h4>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {suggestion.education.map((edu) => (
                    <li key={edu}>{edu}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-4 bg-accent/30 border-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-success" />
                  <h4 className="font-semibold">Key Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestion.skills.slice(0, 8).map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-success/10 text-success-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-accent/30 border-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-destructive" />
                  <h4 className="font-semibold">Why This Matches You</h4>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {suggestion.matchingFactors.map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-4 bg-accent/30 border-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-purple" />
                  <h4 className="font-semibold">Career Outlook</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Growth Outlook:</span>
                    <Badge
                      variant="outline"
                      className={`${
                        suggestion.growthOutlook.includes("High")
                          ? "bg-success/10 text-success border-success/20"
                          : suggestion.growthOutlook.includes("Moderate")
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {suggestion.growthOutlook}
                    </Badge>
                  </div>
                  <Separator className="bg-border" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Salary Range:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-primary/5 rounded">
                        <div className="text-xs text-muted-foreground">Entry</div>
                        <div className="font-medium">${suggestion.salary.entry.toLocaleString()}</div>
                      </div>
                      <div className="p-2 bg-primary/10 rounded">
                        <div className="text-xs text-muted-foreground">Mid</div>
                        <div className="font-medium">
                          $
                          {Math.round(
                            (suggestion.salary.entry + suggestion.salary.senior) / 2
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2 bg-primary/15 rounded">
                        <div className="text-xs text-muted-foreground">Senior</div>
                        <div className="font-medium">
                          ${suggestion.salary.senior.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-accent/30 border-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-info" />
                <h4 className="font-semibold">Match Analysis</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {suggestion.detailedScores.map((score) => (
                  <div key={score.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{score.category}</span>
                      <span className="font-medium">{Math.round(score.score * 100)}%</span>
                    </div>
                    <Progress
                      value={score.score * 100}
                      className="h-2"
                      style={{
                        backgroundColor: `${getScoreColor(score.score)}20`,
                        "--progress-fill": getScoreColor(score.score),
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </motion.div>
  );

  // Utility function to get color based on index using themed colors
  const getCareerColor = (index: number) => {
    const colors = [
      "hsl(var(--brand-blue))",
      "hsl(var(--success))",
      "hsl(var(--brand-purple))",
      "hsl(var(--warning))",
      "hsl(var(--brand-teal))"
    ];
    return colors[index % colors.length];
  };

  // Utility function to get color based on score using themed colors
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "hsl(var(--success))";
    if (score >= 0.6) return "hsl(var(--brand-blue))";
    if (score >= 0.4) return "hsl(var(--brand-purple))";
    if (score >= 0.2) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  // Render introduction screen
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gradient-primary">CareerMap Assessment</CardTitle>
            <CardDescription className="text-lg mt-2">
              Discover your ideal career path based on your unique skills and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <Card key={section.id} className="p-4 hover:bg-accent/50 transition-colors gradient-border">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-primary/10 mr-3">{section.icon}</div>
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{section.description}</p>
                <p className="text-xs mt-2">
                  {section.questions.length} questions • ~{Math.round(section.questions.length / 2)}{" "}
                  min
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-accent/30 border-0">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-brand-blue/20 mr-3">
                <Lightbulb className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center">
                  How It Works
                  <Badge variant="outline" className="ml-2 bg-info/10 text-info border-info/20">
                    ~10 minutes
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This assessment uses advanced algorithms to match your unique profile with potential
                  career paths. Your answers will be analyzed across multiple dimensions including skills,
                  interests, work style, and values.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex items-center">
            <Checkbox 
              id="save-progress" 
              checked={saveProgress}
              onCheckedChange={(checked) => setSaveProgress(!!checked)} 
            />
            <Label htmlFor="save-progress" className="ml-2">
              Save my progress locally
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 ml-2 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground">
                  <p className="max-w-xs">
                    Your responses will be saved in your browser's local storage, allowing you to continue later.
                    No data is sent to our servers until you submit the assessment.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {status === "authenticated" ? (
            <div className="flex items-center text-sm p-2 rounded-md bg-success/10 text-success border border-success/20">
              <Award className="h-4 w-4 mr-2" />
              Signed in as {session?.user?.email}. Your results will be saved to your account.
            </div>
          ) : (
            <div className="flex items-center text-sm p-2 rounded-md bg-warning/10 text-warning border border-warning/20">
              <Info className="h-4 w-4 mr-2" />
              Sign in to save your results and access them later.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {(Object.keys(answers).length > 0 && !suggestions) && (
            <Button variant="outline" onClick={() => setShowIntro(false)} className="gradient-border">
              Continue Assessment
            </Button>
          )}
          <Button variant="default" onClick={() => setShowIntro(false)} className="btn-gradient ml-auto">
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Render loading state
if (isSubmitting) {
  return (
    <Card className="w-full max-w-xl mx-auto glass-card">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-16 w-16 animate-spin mb-6 text-primary" />
        <CardTitle className="mb-2">Analyzing your responses...</CardTitle>
        <CardDescription className="text-center max-w-sm">
          Our algorithm is processing your answers to find the best career matches based on your unique profile.
        </CardDescription>
      </CardContent>
    </Card>
  );
}

// Render error state
if (error) {
  return (
    <Card className="w-full max-w-xl mx-auto glass-card">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-full bg-destructive/10 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-destructive"
          >
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <CardTitle className="mb-2 text-destructive">Something went wrong</CardTitle>
        <CardDescription className="text-center max-w-sm mb-6">{error}</CardDescription>
        <Button onClick={() => setError(null)} className="btn-gradient">Try Again</Button>
      </CardContent>
    </Card>
  );
}

// Render results
if (suggestions) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 w-full max-w-4xl mx-auto"
    >
      <Card className="w-full glass-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-2 bg-primary/10 border-primary/20">
                Assessment Complete
              </Badge>
              <CardTitle className="text-3xl gradient-text">Your Career Matches</CardTitle>
              <CardDescription className="max-w-2xl">
                Based on your comprehensive assessment, here are the careers that best align with your profile,
                skills, and aspirations. Explore each match to learn more.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gradient-border">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gradient-border">
                <Save className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={restartAssessment} className="gradient-border">
                <RotateCw className="h-4 w-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCareerMatchTabs()}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            These suggestions are based on a comprehensive analysis of your responses, considering factors
            like educational background, skills, interests, values, and career aspirations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 border-t-4 border-t-brand-blue">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-brand-blue/20">
                    <BookOpen className="h-5 w-5 text-brand-blue" />
                  </div>
                  <h4 className="font-semibold">Research</h4>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Explore detailed job descriptions</li>
                  <li>Research required qualifications</li>
                  <li>Study industry trends</li>
                  <li>Look into specific companies</li>
                </ul>
              </div>
            </Card>
            
            <Card className="p-4 border-t-4 border-t-success">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-success/20">
                    <GraduationCap className="h-5 w-5 text-success" />
                  </div>
                  <h4 className="font-semibold">Learn</h4>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Identify skills gaps to fill</li>
                  <li>Find relevant courses or programs</li>
                  <li>Seek certifications if applicable</li>
                  <li>Practice through projects</li>
                </ul>
              </div>
            </Card>
            
            <Card className="p-4 border-t-4 border-t-brand-purple">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-brand-purple/20">
                    <Briefcase className="h-5 w-5 text-brand-purple" />
                  </div>
                  <h4 className="font-semibold">Connect</h4>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Network with professionals</li>
                  <li>Join relevant communities</li>
                  <li>Attend industry events</li>
                  <li>Find a mentor</li>
                </ul>
              </div>
            </Card>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-primary mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium">Career Development Resources</h4>
                <p className="text-sm mt-1">
                  We've prepared specialized resources based on your career matches. Check your email for a
                  personalized development plan and relevant opportunities.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={restartAssessment} variant="outline" className="gradient-border">
            <RefreshCw className="h-4 w-4 mr-2" />
            Start New Assessment
          </Button>
          <Button onClick={handleShare} className="btn-gradient">
            <Share className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Render the assessment form
return (
  <motion.div
    key={`${currentSection}-${currentQuestion}`}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2 }}
    className="w-full max-w-2xl mx-auto"
  >
    <Card className="mb-6 glass-card">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {currentSectionData.icon}
            <CardTitle className="ml-2">
              {currentSectionData.title}: {currentQuestion + 1} of {currentSectionData.questions.length}
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 border-primary/20">
            {Math.round(currentOverallProgress)}% Complete
          </Badge>
        </div>
        <Progress value={currentOverallProgress} className="h-2" />
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2">
          <Badge
            variant="outline"
            className={currentQ.required ? "bg-destructive/10 text-destructive border-destructive/20" : ""}
          >
            {currentQ.required ? "Required" : "Optional"}
          </Badge>
          <CardDescription className="text-lg font-medium">
            {currentQ.question}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {renderFormField()}
        {formErrors[currentQ.id] && (
          <p className="text-destructive text-sm mt-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {formErrors[currentQ.id]}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 order-2 sm:order-1">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentQuestion === 0 && currentSection === "initial"}
            className="gradient-border"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} className="btn-gradient">
            {currentQuestion < currentSectionData.questions.length - 1 ||
            currentSection === "initial"
              ? "Next"
              : "Submit"}
            {currentQuestion < currentSectionData.questions.length - 1 ||
            currentSection === "initial" ? (
              <ChevronRight className="h-4 w-4 ml-2" />
            ) : (
              <Send className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
        <div className="flex gap-2 ml-auto order-1 sm:order-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowIntro(true)}>
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground">Show assessment information</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={restartAssessment}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground">Restart assessment</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>

    <Card className="bg-accent/30 border-0 glass-card">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">Assessment Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {renderProgressSummary()}

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentSection === "initial" && currentQuestion === 0}
            onClick={() => handleJumpToSection("initial", 0)}
            className={`justify-start ${currentSection === "initial" ? "gradient-border" : ""}`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Personal Background
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={completionPercentage.initial < 70}
            onClick={() => handleJumpToSection("career", 0)}
            className={`justify-start ${currentSection === "career" ? "gradient-border" : ""}`}
          >
            <Target className="h-4 w-4 mr-2" />
            Career Aspirations
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
}