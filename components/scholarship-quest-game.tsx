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

const careerQuestSchema = z.object({
  educationLevel: z.enum([
    "high_school",
    "certificate",
    "diploma",
    "bachelors",
    "masters",
    "phd",
    "other"
  ], {
    required_error: "Please select your education level"
  }),
  
  fieldPreference: z.enum(["arts", "sciences"], {
    required_error: "Please select your field preference"
  }),
  
  ageRange: z.enum([
    "under_18",
    "18_24",
    "25_34",
    "35_44",
    "45_54",
    "55_plus"
  ], {
    required_error: "Please select your age range"
  }),
  
  gender: z.enum([
    "male",
    "female",
    "non_binary",
    "prefer_not_to_say",
    "other"
  ], {
    required_error: "Please select your gender"
  }),
  
  employmentPreference: z.enum([
    "self_employed",
    "government",
    "private"
  ], {
    required_error: "Please select your preferred employment type"
  }),
  
  selfEmploymentType: z.enum(["profit", "non_profit"]).optional(),
  
  careerSector: z.enum([
    "academia",
    "policy",
    "industry"
  ], {
    required_error: "Please select your preferred career sector"
  }),
  
  unpaidPassion: z.string().min(10, "Please provide more detail about your interests"),
  personalPassion: z.string().min(10, "Please describe your passion in more detail"),
  lifeGoal: z.string().min(10, "Please elaborate on the problem you want to solve"),
  futureTitle: z.string().min(2, "Please specify your desired future title"),
  futureTasks: z.string().min(10, "Please describe your future tasks in more detail"),
  requiredSkills: z.string().min(10, "Please list the required skills"),
  desiredCourses: z.string().min(10, "Please specify the courses you need")
});

type CareerQuestFormValues = z.infer<typeof careerQuestSchema>;

export function CareerGuidanceQuest() {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<CareerQuestFormValues>({
    resolver: zodResolver(careerQuestSchema),
    mode: "onChange",
  });

  const questions = [
    {
      field: "educationLevel",
      label: "What level of education are you?",
      type: "select",
      options: [
        { value: "high_school", label: "High School" },
        { value: "certificate", label: "Certificate" },
        { value: "diploma", label: "Diploma" },
        { value: "bachelors", label: "Bachelor's Degree" },
        { value: "masters", label: "Master's Degree" },
        { value: "phd", label: "PhD" },
        { value: "other", label: "Other" }
      ],
      icon: "🎓"
    },
    {
      field: "fieldPreference",
      label: "Do you want to be in Arts or Sciences?",
      type: "radio",
      options: [
        { value: "arts", label: "Arts" },
        { value: "sciences", label: "Sciences" }
      ],
      icon: "🎨"
    },
    {
      field: "ageRange",
      label: "How old are you?",
      type: "select",
      options: [
        { value: "under_18", label: "Under 18" },
        { value: "18_24", label: "18-24" },
        { value: "25_34", label: "25-34" },
        { value: "35_44", label: "35-44" },
        { value: "45_54", label: "45-54" },
        { value: "55_plus", label: "55+" }
      ],
      icon: "📅"
    },
    {
      field: "gender",
      label: "What is your gender?",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "non_binary", label: "Non-binary" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
        { value: "other", label: "Other" }
      ],
      icon: "👤"
    },
    {
      field: "employmentPreference",
      label: "What type of employment do you prefer?",
      type: "radio",
      options: [
        { value: "self_employed", label: "Self Employment" },
        { value: "government", label: "Government/Public Job" },
        { value: "private", label: "Private/Non-government Job" }
      ],
      icon: "💼"
    },
    {
      field: "selfEmploymentType",
      label: "If self employment, what type do you prefer?",
      type: "radio",
      options: [
        { value: "profit", label: "Business (Profit)" },
        { value: "non_profit", label: "Non-profit Work" }
      ],
      condition: (values: CareerQuestFormValues) => 
        values.employmentPreference === "self_employed",
      icon: "🏢"
    },
    {
      field: "careerSector",
      label: "Which sector do you want to work in?",
      type: "radio",
      options: [
        { value: "academia", label: "Academia (Research)" },
        { value: "policy", label: "Policy (Government Agencies)" },
        { value: "industry", label: "Industry (Private/Non-government)" }
      ],
      icon: "🌟"
    },
    {
      field: "unpaidPassion",
      label: "What do you love doing even without being financially paid?",
      type: "textarea",
      icon: "❤️"
    },
    {
      field: "personalPassion",
      label: "What are you passionate about in your life?",
      type: "textarea",
      icon: "🔥"
    },
    {
      field: "lifeGoal",
      label: "What issue/problem/strategic issue do you want to solve or contribute to before you die?",
      type: "textarea",
      icon: "🎯"
    },
    {
      field: "futureTitle",
      label: "Whom do you want to be called (Title/rank) 30 years from now?",
      type: "text",
      icon: "👑"
    },
    {
      field: "futureTasks",
      label: "What do you want to be doing during that time? (Describe the tasks)",
      type: "textarea",
      icon: "📋"
    },
    {
      field: "requiredSkills",
      label: "What exactly skills do you need to do these tasks?",
      type: "textarea",
      icon: "🛠️"
    },
    {
      field: "desiredCourses",
      label: "What course(s) do you think you need to undertake to gain these skills?",
      type: "textarea",
      icon: "📚"
    }
  ];

  const validateCurrentStep = async () => {
    const currentField = questions[currentStep].field;
    const result = await form.trigger(currentField as any);
    
    if (!result) {
      const error = form.formState.errors[currentField as keyof CareerQuestFormValues];
      setValidationError(error?.message || "Please complete this field correctly");
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
        // Skip conditional questions if condition is not met
        let nextStep = currentStep + 1;
        const nextQuestion = questions[nextStep];
        if (nextQuestion.condition && !nextQuestion.condition(form.getValues())) {
          nextStep += 1;
        }
        setCurrentStep(nextStep);
      }
    }
  };

  const onSubmit = async (data: CareerQuestFormValues) => {
    setIsComplete(true);
    // Here you would typically send the data to your backend
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
                    <FormItem key={option.value} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              ) : type === "select" ? (
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              Career Guidance Quest
            </CardTitle>
            {!isComplete && (
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {questions.length}
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
                  <h2 className="text-3xl font-bold mb-4">Quest Complete!</h2>
                  <p className="text-xl mb-4">
                    Thank you for completing the Career Guidance Quest!
                  </p>
                  <p className="text-gray-600 mb-8">
                    Your responses will help guide your career path.
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
                    // Skip conditional questions when going back
                    const prevQuestion = questions[prevStep];
                    if (prevQuestion?.condition && !prevQuestion.condition(form.getValues())) {
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
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  className="gap-2"
                >
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
