"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  CareerAssessmentAnswers,
  MatchResult,
  Question,
} from "@/types/general";
import { generateCareerMatches, saveAssessmentResults } from "@/lib/career-map";
import { INITIAL_QUESTIONS, CAREER_QUESTIONS } from "./career-map-config";

interface FormErrors {
  [key: string]: string;
}

export function CareerMapGame() {
  const session = useSession();
  const [answers, setAnswers] = useState<Partial<CareerAssessmentAnswers>>({});
  const [currentSection, setCurrentSection] = useState<"initial" | "career">(
    "initial"
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [suggestions, setSuggestions] = useState<MatchResult[] | null>(null);

  const questions =
    currentSection === "initial" ? INITIAL_QUESTIONS : CAREER_QUESTIONS;
  const currentQ = questions[currentQuestion];
  const totalQuestions = INITIAL_QUESTIONS.length + CAREER_QUESTIONS.length;
  const currentProgress =
    (((currentSection === "career" ? INITIAL_QUESTIONS.length : 0) +
      currentQuestion +
      1) /
      totalQuestions) *
    100;

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("careerMapProgress");
    if (savedProgress) {
      try {
        const {
          answers: savedAnswers,
          section,
          question,
        } = JSON.parse(savedProgress);
        setAnswers(savedAnswers);
        setCurrentSection(section);
        setCurrentQuestion(question);
      } catch (error) {
        console.error("Error loading saved progress:", error);
        localStorage.removeItem("careerMapProgress");
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(
      "careerMapProgress",
      JSON.stringify({
        answers,
        section: currentSection,
        question: currentQuestion,
      })
    );
  }, [answers, currentSection, currentQuestion]);

  const validateField = (
    id: string,
    value: string | string[]
  ): string | null => {
    const question = [...INITIAL_QUESTIONS, ...CAREER_QUESTIONS].find(
      (q) => q.id === id
    );
    if (!question?.validation) return null;

    const { required, minLength, maxLength, pattern, maxSelections } =
      question.validation;

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
  };

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

    if (currentQuestion < questions.length - 1) {
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

  const handleSubmit = async () => {
    // Validate all answers before submission
    const allErrors: FormErrors = {};
    let hasErrors = false;

    [...INITIAL_QUESTIONS, ...CAREER_QUESTIONS].forEach((question) => {
      const error = validateField(question.id, answers[question.id] || "");
      if (error) {
        allErrors[question.id] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFormErrors(allErrors);
      toast({
        title: "Form Validation Error",
        description: "Please check all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const matches = generateCareerMatches(answers as CareerAssessmentAnswers);
      const topSuggestions = matches.slice(0, 3);

      if (session?.data?.user?.id || answers.email) {
        await saveAssessmentResults(
          session?.data?.user?.id || (answers.email as string),
          answers as CareerAssessmentAnswers,
          topSuggestions
        );
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
    )}% match for ${
      suggestions[0].title
    }! Key factors: ${suggestions[0].matchingFactors.join(
      ", "
    )}. Find your career match:`;

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

  const restartAssessment = () => {
    setAnswers({});
    setCurrentSection("initial");
    setCurrentQuestion(0);
    setSuggestions(null);
    setError(null);
    localStorage.removeItem("careerMapProgress");
  };

  const renderQuestionHelper = (question: Question) => {
    if (!question.helper) return null;

    return (
      <div className="mt-2 text-sm text-muted-foreground">
        <Info className="inline-block w-4 h-4 mr-1" />
        {question.helper}
      </div>
    );
  };

  const renderSelectionCount = (questionId: string, value: string) => {
    const question = [...INITIAL_QUESTIONS, ...CAREER_QUESTIONS].find(
      (q) => q.id === questionId
    );

    if (!question?.validation?.maxSelections) return null;

    const currentSelections = value.split(",").filter(Boolean).length;
    return (
      <div className="mt-2 text-sm text-muted-foreground">
        Selected: {currentSelections} / {question.validation.maxSelections}
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
              className="space-y-2"
            >
              {currentQ.options?.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentQ.options?.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                >
                  <Checkbox
                    id={option}
                    checked={value.split(",").includes(option)}
                    onCheckedChange={(checked) => {
                      const currentSelections = value
                        .split(",")
                        .filter(Boolean);
                      if (
                        checked &&
                        currentQ.validation?.maxSelections &&
                        currentSelections.length >=
                          currentQ.validation.maxSelections
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
              className={`min-h-[150px] ${error ? "border-red-500" : ""}`}
            />
            {currentQ.validation?.minLength && (
              <div className="text-sm text-muted-foreground">
                Minimum {currentQ.validation.minLength} characters (
                {value.length}/{currentQ.validation.minLength})
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
              className={error ? "border-red-500" : ""}
            />
            {renderQuestionHelper(currentQ)}
          </div>
        );

      default:
        return null;
    }
  };

  const renderCareerMatch = (suggestion: MatchResult, index: number) => (
    <Card key={suggestion.title} className="p-6">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {index + 1}. {suggestion.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              {suggestion.sectors.join(" • ")}
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1">
              <Progress
                value={suggestion.confidence * 100}
                className="h-2 w-32"
              />
            </div>
            <p className="text-sm font-medium">
              {Math.round(suggestion.confidence * 100)}% Match
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">{suggestion.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <h4 className="font-semibold">Education Path</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {suggestion.education.map((edu) => (
                  <li key={edu}>{edu}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <h4 className="font-semibold">Key Skills</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {suggestion.skills.slice(0, 5).map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <h4 className="font-semibold">Why This Matches You</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {suggestion.matchingFactors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <h4 className="font-semibold">Career Outlook</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Growth:</span>{" "}
                  {suggestion.growthOutlook}
                </p>
                <p>
                  <span className="font-medium">Salary Range:</span> $
                  {suggestion.salary.entry.toLocaleString()} - $
                  {suggestion.salary.senior.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Match Analysis</h4>
            <div className="grid grid-cols-2 gap-4">
              {suggestion.detailedScores.map((score) => (
                <div key={score.category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{score.category}</span>
                    <span className="font-medium">
                      {Math.round(score.score * 100)}%
                    </span>
                  </div>
                  <Progress value={score.score * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (isSubmitting) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mb-4" />
          <p className="text-lg">Analyzing your responses...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => setError(null)}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (suggestions) {
    return (
      <div className="space-y-6 w-full max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Career Matches</CardTitle>
            <CardDescription>
              Based on your comprehensive assessment, here are the careers that
              best align with your profile, skills, and aspirations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {suggestions.map((suggestion, index) =>
              renderCareerMatch(suggestion, index)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These suggestions are based on a comprehensive analysis of your
              responses, considering factors like educational background,
              skills, interests, values, and career aspirations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Research</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Explore detailed job descriptions</li>
                  <li>Research required qualifications</li>
                  <li>Study industry trends</li>
                  <li>Look into specific companies</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Connect</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Network with professionals</li>
                  <li>Join relevant communities</li>
                  <li>Attend industry events</li>
                  <li>Find a mentor</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={restartAssessment} variant="outline">
              Start Over
            </Button>
            <Button onClick={handleShare}>Share Results</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Section {currentSection === "initial" ? "1" : "2"} of 2
          </span>
        </div>
        <Progress value={currentProgress} className="h-2" />
        <CardDescription className="mt-4">
          {currentQ.required && <span className="text-red-500">*</span>}{" "}
          {currentQ.question}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderFormField()}
        {formErrors[currentQ.id] && (
          <p className="text-red-500 text-sm mt-2">{formErrors[currentQ.id]}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={currentQuestion === 0 && currentSection === "initial"}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext}>
          {currentQuestion < questions.length - 1 ||
          currentSection === "initial"
            ? "Next"
            : "Submit"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
