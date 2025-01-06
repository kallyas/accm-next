"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import {
  Trophy,
  ChevronRight,
  ChevronLeft,
  Star,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const scholarshipAssessmentSchema = z.object({
  reasonForDegree: z
    .string()
    .min(10, "Please provide a detailed reason (minimum 10 characters)"),
  whyNow: z
    .string()
    .min(10, "Please provide a detailed explanation (minimum 10 characters)"),
  undergraduateCGPA: z
    .number()
    .min(0, "CGPA cannot be negative")
    .max(5, "CGPA must be between 0 and 5"),
  undergraduateCourse: z.string().min(2, "Please provide your course name"),
  workExperienceYears: z
    .number()
    .int("Please enter a whole number")
    .min(0, "Work experience cannot be negative"),
  leadershipExperience: z.boolean(),
  leadershipDetails: z
    .string()
    .optional()
    .refine((val) => {
      if (val === undefined) return true;
      return val.length >= 10 || val.length === 0;
    }, "Please provide detailed leadership experience (minimum 10 characters)"),
  communityService: z.boolean(),
  awardsAndHonors: z.boolean(),
  publications: z.boolean(),
  hasLinkedIn: z.boolean(),
});

type ScholarshipAssessmentFormValues = z.infer<
  typeof scholarshipAssessmentSchema
>;

interface ScholarshipQuestGameProps {
  user: User & {
    scholarshipAssessment: ScholarshipAssessmentFormValues | null;
  };
}

export function ScholarshipQuestGame({
  user,
}: ScholarshipQuestGameProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const form = useForm<ScholarshipAssessmentFormValues>({
    resolver: zodResolver(scholarshipAssessmentSchema),
    mode: "onChange",
    defaultValues: user?.scholarshipAssessment || {
      reasonForDegree: "",
      whyNow: "",
      undergraduateCGPA: 0,
      undergraduateCourse: "",
      workExperienceYears: 0,
      leadershipExperience: false,
      leadershipDetails: "",
      communityService: false,
      awardsAndHonors: false,
      publications: false,
      hasLinkedIn: false,
    },
  });

  const questions = [
    {
      field: "reasonForDegree",
      label: "Why do you want to do a masters degree or PhD?",
      description:
        "Share your motivations and career goals (minimum 10 characters)",
      type: "textarea",
      icon: "🎓",
    },
    {
      field: "whyNow",
      label: "Why Now?",
      description:
        "Explain what makes this the right time (minimum 10 characters)",
      type: "textarea",
      icon: "⏰",
    },
    {
      field: "undergraduateCGPA",
      label: "Undergraduate CGPA",
      description: "Your CGPA on a scale of 0-5",
      type: "number",
      icon: "📊",
    },
    {
      field: "undergraduateCourse",
      label: "Undergraduate Course",
      description: "Your previous field of study",
      type: "text",
      icon: "📚",
    },
    {
      field: "workExperienceYears",
      label: "Years of Work Experience",
      description: "Relevant professional experience in your field",
      type: "number",
      icon: "💼",
    },
    {
      field: "leadershipExperience",
      label: "Leadership Experience",
      description: "Have you held any leadership positions?",
      type: "boolean",
      icon: "👥",
    },
    {
      field: "leadershipDetails",
      label: "Leadership Achievements",
      description:
        "Describe 5 key leadership accomplishments (minimum 10 characters if you have leadership experience)",
      type: "textarea",
      icon: "🎯",
      condition: (values: ScholarshipAssessmentFormValues) =>
        values.leadershipExperience,
    },
    {
      field: "communityService",
      label: "Community Service",
      description: "Have you participated in community service?",
      type: "boolean",
      icon: "🤝",
    },
    {
      field: "awardsAndHonors",
      label: "Awards & Honors",
      description:
        "Have you received any academic or professional recognition?",
      type: "boolean",
      icon: "🏆",
    },
    {
      field: "publications",
      label: "Publications",
      description: "Academic papers, articles, or conference presentations",
      type: "boolean",
      icon: "📝",
    },
    {
      field: "hasLinkedIn",
      label: "LinkedIn Profile",
      description: "Do you maintain a professional online presence?",
      type: "boolean",
      icon: "💼",
    },
  ];

  const calculateScore = (values: ScholarshipAssessmentFormValues) => {
    let newScore = 0;
    if (values.undergraduateCGPA >= 3.5) newScore += 20;
    if (values.workExperienceYears >= 2) newScore += 15;
    if (values.leadershipExperience) newScore += 15;
    if (values.communityService) newScore += 10;
    if (values.awardsAndHonors) newScore += 10;
    if (values.publications) newScore += 20;
    if (values.hasLinkedIn) newScore += 10;
    return newScore;
  };

  const validateCurrentStep = async () => {
    const currentField = questions[currentStep].field;
    const result = await form.trigger(currentField as any);

    if (!result) {
      const error =
        form.formState.errors[
          currentField as keyof ScholarshipAssessmentFormValues
        ];
      setValidationError(
        error?.message || "Please complete this field correctly"
      );
      return false;
    }

    // Special handling for leadership details
    if (
      currentField === "leadershipDetails" &&
      form.getValues("leadershipExperience")
    ) {
      const details = form.getValues("leadershipDetails");
      if (!details || details.length < 10) {
        setValidationError("Please provide detailed leadership experience");
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      if (currentStep === questions.length - 1) {
        form.handleSubmit(onSubmit)();
      } else {
        // Skip leadership details if no leadership experience
        if (
          questions[currentStep + 1].field === "leadershipDetails" &&
          !form.getValues("leadershipExperience")
        ) {
          setCurrentStep(currentStep + 2);
        } else {
          setCurrentStep(currentStep + 1);
        }
      }
    }
  };

  const onSubmit = async (data: ScholarshipAssessmentFormValues) => {
    try {
      const response = await fetch("/api/scholarship-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error("Failed to submit scholarship assessment");

      const finalScore = calculateScore(data);
      setScore(finalScore);
      setCurrentStep(questions.length);

      toast({
        title: "Quest Complete! 🎉",
        description: `Your scholarship potential score: ${finalScore}/100`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentQuestion = questions[currentStep];

  const renderProgressBar = () => {
    const progress = (currentStep / questions.length) * 100;
    return (
      <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl font-bold">
              Scholarship Quest
            </CardTitle>
            {currentStep < questions.length && (
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {questions.length}
              </span>
            )}
          </div>
          {renderProgressBar()}
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              {currentStep < questions.length ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">{currentQuestion.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {currentQuestion.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {currentQuestion.description}
                      </p>
                    </div>
                  </div>

                  {validationError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name={currentQuestion.field as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {currentQuestion.type === "textarea" ? (
                            <Textarea
                              {...field}
                              className="min-h-32"
                              placeholder="Type your answer here..."
                              onChange={(e) => {
                                field.onChange(e);
                                setValidationError(null);
                              }}
                            />
                          ) : currentQuestion.type === "boolean" ? (
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value === "true");
                                setValidationError(null);
                              }}
                              defaultValue={field.value ? "true" : "false"}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="true" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Yes
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="false" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          ) : (
                            <Input
                              type={currentQuestion.type}
                              {...field}
                              placeholder="Enter your answer..."
                              onChange={(e) => {
                                const value =
                                  currentQuestion.type === "number"
                                    ? parseFloat(e.target.value)
                                    : e.target.value;
                                field.onChange(value);
                                setValidationError(null);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-4 bg-blue-50 rounded-full mb-6">
                    <Trophy className="w-16 h-16 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Quest Complete!</h2>
                  <div className="flex items-center justify-center gap-2 mb-8">
                    {[...Array(Math.floor(score / 20))].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-xl mb-2">
                    Your Scholarship Potential Score:
                  </p>
                  <p className="text-5xl font-bold text-blue-600 mb-8">
                    {score}
                    <span className="text-2xl text-gray-500">/100</span>
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentStep(0);
                      setValidationError(null);
                      form.reset();
                    }}
                    className="gap-2"
                  >
                    Retake Quest
                  </Button>
                </div>
              )}
            </CardContent>

            {currentStep < questions.length && (
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setValidationError(null);
                    // Skip leadership details if no leadership experience when going back
                    if (
                      questions[currentStep - 1]?.field ===
                        "leadershipDetails" &&
                      !form.getValues("leadershipExperience")
                    ) {
                      setCurrentStep(currentStep - 2);
                    } else {
                      setCurrentStep(currentStep - 1);
                    }
                  }}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button type="button" onClick={handleNext} className="gap-2">
                  {currentStep === questions.length - 1 ? (
                    <>
                      Submit
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
