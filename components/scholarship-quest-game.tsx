"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  AlertCircle,
  BookOpen,
  Clock,
  GraduationCap,
  Award,
  Briefcase,
  Users,
  Sparkles,
  FileText,
  Globe,
  RefreshCw,
  Save,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const academicQuestSchema = z
  .object({
    motivation: z
      .string()
      .min(
        50,
        "Please provide a detailed explanation (at least 50 characters)"
      ),
    timing: z
      .string()
      .min(
        50,
        "Please explain why you want to pursue this now (at least 50 characters)"
      ),
    degree: z.enum(["masters", "phd", "both"], {
      required_error: "Please select which degree you're interested in",
    }),
    fieldOfStudy: z.string().min(2, "Please specify your field of study"),
    undergradCGPA: z
      .string()
      .min(1, "Please enter your CGPA")
      .regex(
        /^[0-9](\.[0-9]{1,2})?$|^[0-4](\.[0-9]{1,2})?$|^5(\.0{1,2})?$/,
        "Please enter a valid GPA value"
      ),
    gpaScale: z.enum(["4", "5", "other"], {
      required_error: "Please select your GPA scale",
    }),
    customGpaScale: z
      .string()
      .optional()
      .refine((val) => !val || /^\d+(\.\d+)?$/.test(val), {
        message: "Please enter a valid GPA scale (e.g. 10)",
      }),
    undergradCourses: z
      .string()
      .min(10, "Please list all your undergraduate courses"),
    relevantCourses: z
      .string()
      .min(10, "Please list relevant courses for your intended field"),
    workExperience: z
      .string()
      .min(1, "Please enter your years of experience")
      .regex(/^[0-9]+(\.[0-9]+)?$/, "Please enter a valid number"),
    workExperienceDetails: z
      .string()
      .min(
        50,
        "Please provide some details about your work experience (at least 50 characters)"
      )
      .optional(),
    leadership: z.enum(["yes", "no"], {
      required_error: "Please indicate if you have leadership experience",
    }),
    leadershipDetails: z
      .string()
      .min(
        50,
        "Please provide details about your leadership experience (at least 50 characters)"
      )
      .optional(),
    communityService: z.enum(["yes", "no"], {
      required_error:
        "Please indicate if you have community service experience",
    }),
    communityServiceDetails: z
      .string()
      .min(
        50,
        "Please provide details about your community service (at least 50 characters)"
      )
      .optional(),
    awards: z.enum(["yes", "no"], {
      required_error: "Please indicate if you have any awards",
    }),
    awardDetails: z
      .string()
      .min(10, "Please list your awards and honors")
      .optional(),
    publications: z.enum(["yes", "no"], {
      required_error: "Please indicate if you have any publications",
    }),
    publicationDetails: z
      .string()
      .min(10, "Please list your publications")
      .optional(),
    languages: z.string().min(2, "Please list languages you speak"),
    englishProficiency: z.enum(
      ["beginner", "intermediate", "advanced", "native", "certified"],
      {
        required_error: "Please select your English proficiency level",
      }
    ),
    certificationDetails: z
      .string()
      .min(2, "Please provide certification details (IELTS/TOEFL/etc.)")
      .optional(),
    linkedin: z.enum(["yes", "no"], {
      required_error: "Please indicate if you have a LinkedIn account",
    }),
    linkedinOptimized: z
      .enum(["yes", "no", "unsure"], {
        required_error:
          "Please indicate if your LinkedIn is scholarship-optimized",
      })
      .optional(),
    intendedCountries: z
      .string()
      .min(2, "Please list countries you're interested in studying in"),
    fundingNeeds: z.enum(["full", "partial", "flexible"], {
      required_error: "Please select your funding needs",
    }),
    studyTimeline: z.enum(
      ["immediate", "within1year", "1to2years", "2+years"],
      {
        required_error: "Please select your study timeline",
      }
    ),
  })
  .refine(
    (data) => {
      // If leadership is yes, leadershipDetails should be provided
      if (
        data.leadership === "yes" &&
        (!data.leadershipDetails || data.leadershipDetails.length < 50)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide leadership details",
      path: ["leadershipDetails"],
    }
  )
  .refine(
    (data) => {
      // If community service is yes, communityServiceDetails should be provided
      if (
        data.communityService === "yes" &&
        (!data.communityServiceDetails ||
          data.communityServiceDetails.length < 50)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide community service details",
      path: ["communityServiceDetails"],
    }
  )
  .refine(
    (data) => {
      // If awards is yes, awardDetails should be provided
      if (
        data.awards === "yes" &&
        (!data.awardDetails || data.awardDetails.length < 10)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please list your awards",
      path: ["awardDetails"],
    }
  )
  .refine(
    (data) => {
      // If publications is yes, publicationDetails should be provided
      if (
        data.publications === "yes" &&
        (!data.publicationDetails || data.publicationDetails.length < 10)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please list your publications",
      path: ["publicationDetails"],
    }
  )
  .refine(
    (data) => {
      // If work experience is > 0, workExperienceDetails should be provided
      if (
        parseFloat(data.workExperience) > 0 &&
        (!data.workExperienceDetails || data.workExperienceDetails.length < 50)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide work experience details",
      path: ["workExperienceDetails"],
    }
  )
  .refine(
    (data) => {
      // If English proficiency is certified, certificationDetails should be provided
      if (
        data.englishProficiency === "certified" &&
        (!data.certificationDetails || data.certificationDetails.length < 2)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide certification details",
      path: ["certificationDetails"],
    }
  )
  .refine(
    (data) => {
      // If GPA scale is other, customGpaScale should be provided
      if (
        data.gpaScale === "other" &&
        (!data.customGpaScale || data.customGpaScale.length < 1)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide your custom GPA scale",
      path: ["customGpaScale"],
    }
  )
  .refine(
    (data) => {
      // If LinkedIn is yes, linkedinOptimized should be provided
      if (data.linkedin === "yes" && !data.linkedinOptimized) {
        return false;
      }
      return true;
    },
    {
      message: "Please indicate if your LinkedIn profile is optimized",
      path: ["linkedinOptimized"],
    }
  );

type AcademicQuestFormValues = z.infer<typeof academicQuestSchema>;

interface QuestionType {
  field: keyof AcademicQuestFormValues | string;
  label: string;
  type: string;
  icon: React.ReactNode;
  options?: { value: string; label: string }[];
  condition?: (values: AcademicQuestFormValues) => boolean;
  helper?: string;
  section?: string;
  animation?: string;
}

export function AcademicQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [section, setSection] = useState("motivation");
  const [completionPercentage, setCompletionPercentage] = useState<
    Record<string, number>
  >({
    motivation: 0,
    academic: 0,
    experience: 0,
    language: 0,
    planning: 0,
  });

  // Define sections for better navigation
  const sections = [
    {
      id: "motivation",
      title: "Motivation",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      id: "academic",
      title: "Academic Background",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      id: "experience",
      title: "Experience",
      icon: <Briefcase className="h-4 w-4" />,
    },
    { id: "language", title: "Languages", icon: <Globe className="h-4 w-4" /> },
    { id: "planning", title: "Planning", icon: <Clock className="h-4 w-4" /> },
  ];

  const form = useForm<AcademicQuestFormValues>({
    resolver: zodResolver(academicQuestSchema),
    mode: "onChange",
    defaultValues: {
      workExperience: "0",
    },
  });

  // Questions organized by section
  const questions: QuestionType[] = [
    // Motivation Section
    {
      field: "motivation",
      label: "Why do you want to pursue a graduate degree?",
      type: "textarea",
      icon: <Sparkles className="h-5 w-5 text-indigo-500" />,
      helper:
        "Explain your academic and career motivations for pursuing higher education",
      section: "motivation",
      animation: "fade-right",
    },
    {
      field: "timing",
      label: "Why is now the right time for graduate studies?",
      type: "textarea",
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      helper:
        "Explain why this point in your career is ideal for further education",
      section: "motivation",
      animation: "fade-left",
    },
    {
      field: "degree",
      label: "Which degree are you interested in pursuing?",
      type: "radio",
      options: [
        { value: "masters", label: "Master's Degree" },
        { value: "phd", label: "PhD" },
        { value: "both", label: "Both (Master's followed by PhD)" },
      ],
      icon: <Award className="h-5 w-5 text-indigo-500" />,
      section: "motivation",
      animation: "fade-up",
    },
    {
      field: "fieldOfStudy",
      label: "What field do you want to study?",
      type: "text",
      icon: <BookOpen className="h-5 w-5 text-indigo-500" />,
      helper: "Specify your intended field/discipline of study",
      section: "motivation",
      animation: "fade-down",
    },

    // Academic Background Section
    {
      field: "undergradCGPA",
      label: "What was your undergraduate CGPA?",
      type: "text",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      helper: "Enter your cumulative GPA from your undergraduate degree",
      section: "academic",
      animation: "fade-right",
    },
    {
      field: "gpaScale",
      label: "What GPA scale was used at your university?",
      type: "radio",
      options: [
        { value: "4", label: "4.0 Scale" },
        { value: "5", label: "5.0 Scale" },
        { value: "other", label: "Other Scale" },
      ],
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      section: "academic",
      animation: "fade-left",
    },
    {
      field: "customGpaScale",
      label: "Please specify your GPA scale",
      type: "text",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      helper: "Enter the maximum value of your GPA scale (e.g., 10)",
      condition: (values) => values.gpaScale === "other",
      section: "academic",
      animation: "fade-up",
    },
    {
      field: "undergradCourses",
      label: "What courses did you take in your undergraduate program?",
      type: "textarea",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      helper: "List major courses you completed in your undergraduate studies",
      section: "academic",
      animation: "fade-right",
    },
    {
      field: "relevantCourses",
      label: "Which courses are most relevant to your intended field of study?",
      type: "textarea",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      helper:
        "Highlight courses that directly relate to your graduate study plans",
      section: "academic",
      animation: "fade-left",
    },

    // Experience Section
    {
      field: "workExperience",
      label: "How many years of relevant work experience do you have?",
      type: "text",
      icon: <Briefcase className="h-5 w-5 text-green-500" />,
      helper:
        "Enter the number of years of professional experience related to your field",
      section: "experience",
      animation: "fade-up",
    },
    {
      field: "workExperienceDetails",
      label: "Please describe your relevant work experience",
      type: "textarea",
      icon: <Briefcase className="h-5 w-5 text-green-500" />,
      helper: "Describe positions, responsibilities, and achievements",
      condition: (values) => parseFloat(values.workExperience) > 0,
      section: "experience",
      animation: "fade-down",
    },
    {
      field: "leadership",
      label: "Have you held leadership positions?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: <Users className="h-5 w-5 text-green-500" />,
      section: "experience",
      animation: "fade-right",
    },
    {
      field: "leadershipDetails",
      label: "Please describe your leadership experiences and outcomes",
      type: "textarea",
      icon: <Users className="h-5 w-5 text-green-500" />,
      helper: "Detail your responsibilities and accomplishments as a leader",
      condition: (values) => values.leadership === "yes",
      section: "experience",
      animation: "fade-left",
    },
    {
      field: "communityService",
      label: "Have you participated in community service or volunteer work?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: <Users className="h-5 w-5 text-green-500" />,
      section: "experience",
      animation: "fade-up",
    },
    {
      field: "communityServiceDetails",
      label: "Please describe your community service or volunteer work",
      type: "textarea",
      icon: <Users className="h-5 w-5 text-green-500" />,
      helper: "Include organizations, roles, and impact of your service",
      condition: (values) => values.communityService === "yes",
      section: "experience",
      animation: "fade-down",
    },
    {
      field: "awards",
      label: "Have you received any academic or professional awards/honors?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: <Award className="h-5 w-5 text-green-500" />,
      section: "experience",
      animation: "fade-right",
    },
    {
      field: "awardDetails",
      label: "Please list your awards and honors",
      type: "textarea",
      icon: <Award className="h-5 w-5 text-green-500" />,
      helper: "Include the name, date, and significance of each award",
      condition: (values) => values.awards === "yes",
      section: "experience",
      animation: "fade-left",
    },
    {
      field: "publications",
      label: "Do you have any publications or presentations?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: <FileText className="h-5 w-5 text-green-500" />,
      helper: "Include articles, papers, conference presentations, etc.",
      section: "experience",
      animation: "fade-up",
    },
    {
      field: "publicationDetails",
      label: "Please list your publications and presentations",
      type: "textarea",
      icon: <FileText className="h-5 w-5 text-green-500" />,
      helper: "Include title, publication venue, date, and your role",
      condition: (values) => values.publications === "yes",
      section: "experience",
      animation: "fade-down",
    },

    // Language Section
    {
      field: "languages",
      label: "Which languages do you speak?",
      type: "text",
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      helper: "List all languages you speak and your proficiency level in each",
      section: "language",
      animation: "fade-right",
    },
    {
      field: "englishProficiency",
      label: "What is your level of English proficiency?",
      type: "radio",
      options: [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
        { value: "native", label: "Native Speaker" },
        { value: "certified", label: "Certified (IELTS/TOEFL/etc.)" },
      ],
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      section: "language",
      animation: "fade-left",
    },
    {
      field: "certificationDetails",
      label: "Please provide details of your English certification",
      type: "text",
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      helper: "Include test name, score, and date (e.g., IELTS 7.5, June 2023)",
      condition: (values) => values.englishProficiency === "certified",
      section: "language",
      animation: "fade-up",
    },
    {
      field: "linkedin",
      label: "Do you have a LinkedIn profile?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      icon: <Briefcase className="h-5 w-5 text-purple-500" />,
      section: "language",
      animation: "fade-down",
    },
    {
      field: "linkedinOptimized",
      label: "Is your LinkedIn profile optimized for scholarship applications?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Not Sure" },
      ],
      icon: <Briefcase className="h-5 w-5 text-purple-500" />,
      condition: (values) => values.linkedin === "yes",
      helper:
        "An optimized profile highlights academic achievements, research, and scholarly activities",
      section: "language",
      animation: "fade-right",
    },

    // Planning Section
    {
      field: "intendedCountries",
      label: "Which countries are you interested in studying in?",
      type: "text",
      icon: <Globe className="h-5 w-5 text-amber-500" />,
      helper:
        "List the countries where you'd like to pursue your graduate studies",
      section: "planning",
      animation: "fade-left",
    },
    {
      field: "fundingNeeds",
      label: "What level of scholarship funding do you require?",
      type: "radio",
      options: [
        { value: "full", label: "Full Funding (Tuition + Living Expenses)" },
        { value: "partial", label: "Partial Funding (Tuition Only)" },
        { value: "flexible", label: "Flexible (Will Consider Any Funding)" },
      ],
      icon: <Award className="h-5 w-5 text-amber-500" />,
      section: "planning",
      animation: "fade-up",
    },
    {
      field: "studyTimeline",
      label: "When do you plan to begin your graduate studies?",
      type: "radio",
      options: [
        { value: "immediate", label: "As Soon as Possible" },
        { value: "within1year", label: "Within 1 Year" },
        { value: "1to2years", label: "1-2 Years from Now" },
        { value: "2+years", label: "More than 2 Years from Now" },
      ],
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      section: "planning",
      animation: "fade-down",
    },
  ];

  // Filter questions by current section
  const sectionQuestions = questions.filter((q) => q.section === section);

  // Calculate current question index within the current section
  const sectionQuestionIndex = sectionQuestions.findIndex(
    (q, i) => i === currentStep
  );

  // Calculate overall progress
  useEffect(() => {
    const calcSectionCompletion = (sectionId: string) => {
      const sectionQuestions = questions.filter((q) => q.section === sectionId);
      const answeredQuestions = sectionQuestions.filter((q) => {
        // Check if question has a condition and if it's met
        if (q.condition) {
          if (!q.condition(form.getValues())) {
            return true; // Skip this question as condition not met
          }
        }

        // Check if field is answered
        const value =
          form.getValues()[q.field as keyof AcademicQuestFormValues];
        return value !== undefined && value !== "";
      });

      return (answeredQuestions.length / sectionQuestions.length) * 100;
    };

    setCompletionPercentage({
      motivation: calcSectionCompletion("motivation"),
      academic: calcSectionCompletion("academic"),
      experience: calcSectionCompletion("experience"),
      language: calcSectionCompletion("language"),
      planning: calcSectionCompletion("planning"),
    });
  }, [form, questions, section, currentStep]);

  const validateCurrentStep = async () => {
    const currentField = sectionQuestions[currentStep].field;

    // Skip validation for conditional fields that aren't applicable
    if (sectionQuestions[currentStep].condition) {
      const condition = sectionQuestions[currentStep].condition;
      if (condition && !condition(form.getValues())) {
        setValidationError(null);
        return true;
      }
    }

    const result = await form.trigger(currentField as any);

    if (!result) {
      const error =
        form.formState.errors[currentField as keyof AcademicQuestFormValues];
      setValidationError(
        (error?.message as string) || "Please complete this field correctly"
      );
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      if (currentStep === sectionQuestions.length - 1) {
        // If last question in section, move to next section
        const currentSectionIndex = sections.findIndex((s) => s.id === section);
        if (currentSectionIndex < sections.length - 1) {
          setSection(sections[currentSectionIndex + 1].id);
          setCurrentStep(0);
        } else {
          // If last section, submit form
          handleSubmit();
        }
      } else {
        // Move to next question in current section
        let nextStep = currentStep + 1;
        const nextQuestion = sectionQuestions[nextStep];
        if (
          nextQuestion.condition &&
          !nextQuestion.condition(form.getValues())
        ) {
          // Skip questions whose conditions aren't met
          nextStep += 1;
          if (nextStep >= sectionQuestions.length) {
            // If we've skipped to the end of the section, move to next section
            const currentSectionIndex = sections.findIndex(
              (s) => s.id === section
            );
            if (currentSectionIndex < sections.length - 1) {
              setSection(sections[currentSectionIndex + 1].id);
              setCurrentStep(0);
            } else {
              // If last section, submit form
              handleSubmit();
            }
            return;
          }
        }
        setCurrentStep(nextStep);
      }
    }
  };

  const handlePrevious = () => {
    setValidationError(null);
    if (currentStep > 0) {
      // Move to previous question in current section
      let prevStep = currentStep - 1;
      const prevQuestion = sectionQuestions[prevStep];

      if (prevQuestion.condition && !prevQuestion.condition(form.getValues())) {
        // Skip questions whose conditions aren't met
        prevStep -= 1;
      }

      if (prevStep < 0) {
        // If we've skipped past the beginning of the section, move to previous section
        const currentSectionIndex = sections.findIndex((s) => s.id === section);
        if (currentSectionIndex > 0) {
          const prevSection = sections[currentSectionIndex - 1].id;
          const prevSectionQuestions = questions.filter(
            (q) => q.section === prevSection
          );
          setSection(prevSection);
          setCurrentStep(prevSectionQuestions.length - 1);
        } else {
          // If first section, stay at first question
          setCurrentStep(0);
        }
      } else {
        setCurrentStep(prevStep);
      }
    } else {
      // If at first question of section, move to previous section
      const currentSectionIndex = sections.findIndex((s) => s.id === section);
      if (currentSectionIndex > 0) {
        const prevSection = sections[currentSectionIndex - 1].id;
        const prevSectionQuestions = questions.filter(
          (q) => q.section === prevSection
        );
        setSection(prevSection);
        setCurrentStep(prevSectionQuestions.length - 1);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate all fields before submission
      const isValid = await form.trigger();

      if (!isValid) {
        // Find the first section with errors
        for (const s of sections) {
          const sectionFields = questions
            .filter((q) => q.section === s.id)
            .map((q) => q.field);

          const hasError = sectionFields.some(
            (field) =>
              form.formState.errors[field as keyof AcademicQuestFormValues]
          );

          if (hasError) {
            setSection(s.id);
            // Find the first question with an error in this section
            const errorQuestionIndex = questions
              .filter((q) => q.section === s.id)
              .findIndex(
                (q) =>
                  form.formState.errors[
                    q.field as keyof AcademicQuestFormValues
                  ]
              );

            setCurrentStep(Math.max(0, errorQuestionIndex));
            setValidationError("Please correct the errors before submitting");
            break;
          }
        }
        setIsSubmitting(false);
        return;
      }

      // Process form submission
      const data = form.getValues();
      console.log("Form submitted:", data);

      // In a real application, you would send this data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      setIsComplete(true);
    } catch (error) {
      console.error("Submission error:", error);
      setValidationError(
        "An error occurred during submission. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const jumpToSection = (sectionId: string) => {
    setSection(sectionId);
    setCurrentStep(0);
    setValidationError(null);
  };

  const currentQuestion = sectionQuestions[currentStep] || questions[0];
  const totalSectionQuestions = sectionQuestions.length;

  const renderProgressIndicator = () => {
    return (
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Question {currentStep + 1} of {totalSectionQuestions}
          </span>
          <span>
            {section.charAt(0).toUpperCase() + section.slice(1)} Section
          </span>
        </div>
        <Progress
          value={(currentStep / Math.max(totalSectionQuestions - 1, 1)) * 100}
          className="h-2"
          indicatorColor={
            section === "motivation"
              ? "bg-indigo-500"
              : section === "academic"
              ? "bg-blue-500"
              : section === "experience"
              ? "bg-green-500"
              : section === "language"
              ? "bg-purple-500"
              : "bg-amber-500"
          }
        />
      </div>
    );
  };

  const renderSectionNav = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => jumpToSection(s.id)}
            className={`flex items-center px-3 py-2 text-xs rounded-full transition-colors ${
              section === s.id
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {s.icon}
            <span className="ml-1">{s.title}</span>

            {/* Completion indicator */}
            <span
              className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                completionPercentage[s.id] === 100
                  ? "bg-success/20 text-success"
                  : completionPercentage[s.id] > 0
                  ? "bg-blue-500/20 text-blue-600 dark:bg-blue-400/30 dark:text-blue-300"
                  : "bg-muted-foreground/20 text-muted-foreground"
              }`}
            >
              {Math.round(completionPercentage[s.id])}%
            </span>
          </button>
        ))}
      </div>
    );
  };

  const renderField = (question: QuestionType) => {
    const { field, type, options } = question;

    return (
      <FormField
        control={form.control}
        name={field as any}
        render={({ field: formField }) => (
          <FormItem className="space-y-3">
            <FormControl>
              {type === "textarea" ? (
                <div className="space-y-2">
                  <Textarea
                    {...formField}
                    className="min-h-32 resize-y"
                    placeholder={`Type your answer here...`}
                    onChange={(e) => {
                      formField.onChange(e);
                      setValidationError(null);
                    }}
                  />
                  {formField.value && typeof formField.value === "string" && (
                    <div className="text-xs text-right text-muted-foreground">
                      {formField.value.length} characters
                      {question.field === "motivation" ||
                      question.field === "timing"
                        ? ` (minimum 50)`
                        : ""}
                    </div>
                  )}
                </div>
              ) : type === "radio" ? (
                <RadioGroup
                  onValueChange={(value) => {
                    formField.onChange(value);
                    setValidationError(null);
                  }}
                  value={formField.value}
                  className="space-y-3"
                >
                  {options?.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${field}-${option.value}`}
                      />
                      <FormLabel
                        htmlFor={`${field}-${option.value}`}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {option.label}
                      </FormLabel>
                    </div>
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
            {question.helper && (
              <FormDescription className="mt-1 flex items-center gap-1 text-xs">
                <Info className="h-3 w-3" />
                {question.helper}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
    );
  };

  const renderCompletionStats = () => {
    // Calculate overall completion percentage
    const totalQuestions = questions.length;
    const answeredQuestions = Object.entries(form.getValues()).filter(
      ([_, value]) => value !== undefined && value !== ""
    ).length;

    const overallPercentage = Math.round(
      (answeredQuestions / totalQuestions) * 100
    );

    const completionLevel =
      overallPercentage >= 90
        ? "Excellent"
        : overallPercentage >= 70
        ? "Good"
        : overallPercentage >= 50
        ? "Fair"
        : "Basic";

    // Calculate scholarship readiness score based on key factors
    const values = form.getValues();
    let readinessScore = 0;

    // Academic factors
    if (values.gpaScale === "4" && parseFloat(values.undergradCGPA) >= 3.5)
      readinessScore += 20;
    else if (values.gpaScale === "5" && parseFloat(values.undergradCGPA) >= 4.5)
      readinessScore += 20;
    else if (parseFloat(values.undergradCGPA) > 0) readinessScore += 10;

    // Experience factors
    if (parseFloat(values.workExperience) >= 2) readinessScore += 15;
    else if (parseFloat(values.workExperience) > 0) readinessScore += 10;

    if (values.leadership === "yes") readinessScore += 15;
    if (values.publications === "yes") readinessScore += 20;
    if (values.awards === "yes") readinessScore += 15;
    if (values.communityService === "yes") readinessScore += 10;

    // Language factors
    if (
      values.englishProficiency === "certified" ||
      values.englishProficiency === "native"
    )
      readinessScore += 15;
    else if (values.englishProficiency === "advanced") readinessScore += 10;

    // Overall profile strength
    const profileStrength =
      readinessScore >= 80
        ? "Strong"
        : readinessScore >= 60
        ? "Competitive"
        : readinessScore >= 40
        ? "Developing"
        : "Needs Enhancement";

    // Calculate scholarship match types based on profile
    const scholarshipMatches = [];

    if (readinessScore >= 70)
      scholarshipMatches.push("Merit-Based Academic Scholarships");
    if (values.leadership === "yes" && values.communityService === "yes")
      scholarshipMatches.push("Leadership Scholarships");
    if (values.publications === "yes")
      scholarshipMatches.push("Research Fellowships");
    if (parseFloat(values.workExperience) >= 2)
      scholarshipMatches.push("Professional Development Grants");
    if (profileStrength === "Strong" || profileStrength === "Competitive")
      scholarshipMatches.push("Competitive International Scholarships");

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-0 shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  Profile Completion
                </h3>
                <div className="mt-2 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-900 shadow-inner">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {overallPercentage}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  {completionLevel} Completion
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-0 shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">
                  Scholarship Readiness
                </h3>
                <div className="mt-2 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-900 shadow-inner">
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {readinessScore}/100
                  </span>
                </div>
                <p className="mt-2 text-sm text-purple-700 dark:text-purple-400">
                  {profileStrength} Profile
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/40 dark:to-teal-950/40 border-0 shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400">
                  Next Steps
                </h3>
                <div className="mt-2 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-900 shadow-inner">
                  <Sparkles className="w-12 h-12 text-green-500 dark:text-green-400" />
                </div>
                <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                  Personalized Guidance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scholarship Match Analysis</CardTitle>
            <CardDescription>
              Based on your profile, you're a good match for these scholarship
              types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scholarshipMatches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {scholarshipMatches.map((type, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border-blue-500/20 dark:border-blue-400/20 px-3 py-1"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Complete more sections to see scholarship matches
                </p>
              )}

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Profile Strengths</h4>
                <ul className="space-y-2">
                  {values.leadership === "yes" && (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Leadership experience</span>
                    </li>
                  )}
                  {values.publications === "yes" && (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Publications or presentations</span>
                    </li>
                  )}
                  {values.awards === "yes" && (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Academic awards or honors</span>
                    </li>
                  )}
                  {parseFloat(values.workExperience) >= 2 && (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Relevant work experience</span>
                    </li>
                  )}
                  {values.englishProficiency === "certified" && (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Certified English proficiency</span>
                    </li>
                  )}
                  {values.communityService === "yes" && (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Community service/volunteer work</span>
                    </li>
                  )}
                  {(values.gpaScale === "4" &&
                    parseFloat(values.undergradCGPA) >= 3.5) ||
                    (values.gpaScale === "5" &&
                      parseFloat(values.undergradCGPA) >= 4.5 && (
                        <li className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span>Strong academic performance</span>
                        </li>
                      ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Areas for Enhancement</h4>
                <ul className="space-y-2">
                  {!values.leadership || values.leadership === "no" ? (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span>Gain leadership experience</span>
                    </li>
                  ) : null}
                  {!values.publications || values.publications === "no" ? (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span>Pursue publication opportunities</span>
                    </li>
                  ) : null}
                  {parseFloat(values.workExperience || "0") < 1 && (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span>Gain relevant work or research experience</span>
                    </li>
                  )}
                  {!values.awards || values.awards === "no" ? (
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span>Seek academic recognition opportunities</span>
                    </li>
                  ) : null}
                  {values.englishProficiency !== "certified" &&
                    values.englishProficiency !== "native" && (
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        <span>Obtain English proficiency certification</span>
                      </li>
                    )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  onClick={() =>
                    (window.location.href = "/scholarship-quest/opportunities")
                  }
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Find Scholarships
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View scholarships matching your profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(0);
              setSection("motivation");
              setIsComplete(false);
              setValidationError(null);
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Card className="w-full shadow-md card-3d overflow-hidden border border-blue-100/50 dark:border-blue-900/20">
        <CardHeader className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-100/50 dark:border-blue-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge
                variant="outline"
                className="mb-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
              >
                Academic Assessment
              </Badge>
              <CardTitle className="text-2xl font-bold text-gradient-primary">
                Scholarship Questionnaire
              </CardTitle>
              {!isComplete && (
                <p className="text-sm text-muted-foreground mt-1">
                  Complete this assessment to discover scholarship opportunities
                </p>
              )}
            </div>

            {!isComplete && (
              <div className="flex-shrink-0 hidden sm:block">
                {renderProgressIndicator()}
              </div>
            )}
          </div>

          {!isComplete && (
            <div className="sm:hidden mt-4">{renderProgressIndicator()}</div>
          )}

          {!isComplete && renderSectionNav()}
        </CardHeader>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {!isComplete ? (
                  <motion.div
                    key={`${section}-${currentStep}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <div className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400">
                        {currentQuestion.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                          {currentQuestion.label}
                        </h3>
                      </div>
                    </div>

                    {validationError && (
                      <Alert
                        variant="destructive"
                        className="mb-4 animate-shake"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{validationError}</AlertDescription>
                      </Alert>
                    )}

                    {renderField(currentQuestion)}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="py-6"
                  >
                    <div className="text-center mb-8">
                      <div className="inline-block p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 text-white">
                        <Trophy className="w-14 h-14" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4 text-gradient-primary">
                        Assessment Complete!
                      </h2>
                      <p className="text-xl mb-6 text-muted-foreground">
                        We've analyzed your academic profile
                      </p>
                    </div>

                    {renderCompletionStats()}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            {!isComplete && (
              <CardFooter className="flex justify-between p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-t border-blue-100/50 dark:border-blue-900/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 && section === sections[0].id}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      localStorage.setItem(
                        "scholarship_profile",
                        JSON.stringify(form.getValues())
                      );
                      // Show a toast or notification here
                    }}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : currentStep === sectionQuestions.length - 1 &&
                      section === sections[sections.length - 1].id ? (
                      <>
                        Submit
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : currentStep === sectionQuestions.length - 1 ? (
                      <>
                        Next Section
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
