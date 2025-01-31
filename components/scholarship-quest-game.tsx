"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Trophy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const academicQuestSchema = z.object({
  motivation: z
    .string()
    .min(50, "Please provide a detailed explanation of your motivation"),
  timing: z.string().min(50, "Please explain why you want to pursue this now"),
  undergradCGPA: z.string().min(1, "Please enter your CGPA"),
  gpaScale: z.enum(["4", "5"], {
    required_error: "Please select your GPA scale",
  }),
  undergradCourses: z
    .string()
    .min(10, "Please list all your undergraduate courses"),
  workExperience: z.string().min(1, "Please enter your years of experience"),
  leadership: z.enum(["yes", "no"], {
    required_error: "Please indicate if you have leadership experience",
  }),
  leadershipDetails: z
    .string()
    .min(50, "Please provide details about your leadership experience")
    .optional(),
  communityService: z.enum(["yes", "no"], {
    required_error: "Please indicate if you have community service experience",
  }),
  awards: z.enum(["yes", "no"], {
    required_error: "Please indicate if you have any awards",
  }),
  publications: z.enum(["yes", "no"], {
    required_error: "Please indicate if you have any publications",
  }),
  linkedin: z.enum(["yes", "no"], {
    required_error: "Please indicate if you have a LinkedIn account",
  }),
});

type AcademicQuestFormValues = z.infer<typeof academicQuestSchema>;

export function AcademicQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<AcademicQuestFormValues>({
    resolver: zodResolver(academicQuestSchema),
    mode: "onChange",
  });

  const questions = [
    {
      field: "motivation",
      label: "Why do you want to do a masters degree or PhD?",
      type: "textarea",
      icon: "🎓",
    },
    {
      field: "timing",
      label: "Why Now?",
      type: "textarea",
      icon: "⏰",
    },
    {
      field: "undergradCGPA",
      label: "What was your CGPA at UNDERGRADUATE?",
      type: "text",
      icon: "📊",
    },
    {
      field: "gpaScale",
      label: "Select your GPA Scale",
      type: "radio",
      options: [
        { value: "4", label: "4.0 Scale" },
        { value: "5", label: "5.0 Scale" },
      ],
      icon: "📏",
    },
    {
      field: "undergradCourses",
      label: "What was your course at Undergraduate? (List all courses)",
      type: "textarea",
      icon: "📚",
    },
    {
      field: "workExperience",
      label: "How many years of relevant work experience do you have?",
      type: "text",
      icon: "💼",
    },
    {
      field: "leadership",
      label: "Have you been a leader?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: "👥",
    },
    {
      field: "leadershipDetails",
      label:
        "What are those 5 things you did as a leader and what came out of that?",
      type: "textarea",
      condition: (values: AcademicQuestFormValues) =>
        values.leadership === "yes",
      icon: "🎯",
    },
    {
      field: "communityService",
      label: "Have you been involved in community service?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: "🤝",
    },
    {
      field: "awards",
      label: "Do you have any awards/Honors?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: "🏆",
    },
    {
      field: "publications",
      label:
        "Do you have any publications (News paper articles, journal papers, conference presentations)?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: "📝",
    },
    {
      field: "linkedin",
      label: "Do you have a LinkedIn Account?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: "💼",
    },
  ];

  const validateCurrentStep = async () => {
    const currentField = questions[currentStep].field;
    const result = await form.trigger(currentField as any);

    if (!result) {
      const error =
        form.formState.errors[currentField as keyof AcademicQuestFormValues];
      setValidationError(
        error?.message || "Please complete this field correctly"
      );
      return false;
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
        let nextStep = currentStep + 1;
        const nextQuestion = questions[nextStep];
        if (
          nextQuestion.condition &&
          !nextQuestion.condition(form.getValues())
        ) {
          nextStep += 1;
        }
        setCurrentStep(nextStep);
      }
    }
  };

  const onSubmit = async (data: AcademicQuestFormValues) => {
    setIsComplete(true);
    console.log("Form submitted:", data);
  };

  const renderField = (question: any) => {
    const { field, type, options } = question;

    return (
      <FormField
        control={form.control}
        name={field as any}
        render={({ field: formField }) => (
          <FormItem>
            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  {...formField}
                  className="min-h-32"
                  placeholder="Type your answer here..."
                  onChange={(e) => {
                    formField.onChange(e);
                    setValidationError(null);
                  }}
                />
              ) : type === "radio" ? (
                <RadioGroup
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                  className="flex flex-col gap-4"
                >
                  {options.map((option: any) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              ) : (
                <Input
                  {...formField}
                  placeholder="Enter your answer..."
                  onChange={(e) => {
                    formField.onChange(e);
                    setValidationError(null);
                  }}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

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

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl font-bold">
              Academic Background Questionnaire
            </CardTitle>
            {!isComplete && (
              <span className="text-sm text-gray-500">
                Question {currentStep + 1} of {questions.length}
              </span>
            )}
          </div>
          {!isComplete && renderProgressBar()}
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              {!isComplete ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">{currentQuestion.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {currentQuestion.label}
                      </h3>
                    </div>
                  </div>

                  {validationError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  {renderField(currentQuestion)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-4 bg-blue-50 rounded-full mb-6">
                    <Trophy className="w-16 h-16 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    Questionnaire Complete!
                  </h2>
                  <p className="text-xl mb-4">
                    Thank you for completing the Academic Background
                    Questionnaire!
                  </p>
                  <p className="text-gray-600 mb-8">
                    Your responses will help evaluate your academic preparation.
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentStep(0);
                      setIsComplete(false);
                      setValidationError(null);
                      form.reset();
                    }}
                  >
                    Start Over
                  </Button>
                </div>
              )}
            </CardContent>

            {!isComplete && (
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setValidationError(null);
                    let prevStep = currentStep - 1;
                    const prevQuestion = questions[prevStep];
                    if (
                      prevQuestion?.condition &&
                      !prevQuestion.condition(form.getValues())
                    ) {
                      prevStep -= 1;
                    }
                    setCurrentStep(Math.max(0, prevStep));
                  }}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button type="button" onClick={handleNext} className="gap-2">
                  {currentStep === questions.length - 1 ? (
                    "Submit"
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
