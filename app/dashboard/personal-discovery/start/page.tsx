"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { YouTubePlayer } from "@/components/video-player";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  HelpCircle,
  Info,
  Save,
  Star,
  Upload,
  XCircle,
  Briefcase,
  Target,
  Calendar,
  Loader2,
  AlertTriangle,
  Award,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type FormSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  fields: FormField[];
};

type FormField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "tags";
  placeholder: string;
  helpText: string;
  required: boolean;
  exampleText?: string;
};

export default function StartPersonalDiscoveryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("introduction");
  const [activeSection, setActiveSection] = useState("strengths");
  const [file, setFile] = useState<File | null>(null);
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Load saved form data if available
  useEffect(() => {
    const savedData = localStorage.getItem("personalDiscoveryForm");
    const savedVideo = localStorage.getItem("isWatched");

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    if (savedVideo === "true") {
      setIsVideoWatched(true);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("personalDiscoveryForm", JSON.stringify(formData));
    }
  }, [formData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate all required fields
    formSections.forEach((section) => {
      section.fields.forEach((field) => {
        if (
          field.required &&
          (!formData[field.id] || formData[field.id].trim() === "")
        ) {
          errors[field.id] = "This field is required";
        }
      });
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const formDataObj = new FormData(event.currentTarget);
    if (file) {
      formDataObj.append("file", file);
    }

    try {
      const response = await fetch("/api/personal-discovery", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error("Failed to submit personal discovery");
      }

      toast({
        title: "Personal Discovery Submitted",
        description:
          "Your personal discovery information has been saved and is being analyzed.",
      });

      // Clear saved form data after successful submission
      localStorage.removeItem("personalDiscoveryForm");

      router.push("/dashboard/personal-discovery");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit personal discovery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProgress = () => {
    // Save is automatic via the useEffect, just show confirmation
    toast({
      title: "Progress Saved",
      description:
        "Your form data has been saved locally. You can continue later.",
    });
  };

  const handleVideoComplete = () => {
    localStorage.setItem("isWatched", "true");
    setIsVideoWatched(true);
  };

  // Calculate completion percentage
  const calculateProgress = (): number => {
    const totalFields = formSections.reduce(
      (count, section) =>
        count + section.fields.filter((field) => field.required).length,
      0
    );

    if (totalFields === 0) return 0;

    const filledFields = formSections.reduce((count, section) => {
      return (
        count +
        section.fields.filter(
          (field) =>
            field.required &&
            formData[field.id] &&
            formData[field.id].trim() !== ""
        ).length
      );
    }, 0);

    return Math.round((filledFields / totalFields) * 100);
  };

  // Define form sections and fields
  const formSections: FormSection[] = [
    {
      id: "strengths",
      title: "Strengths",
      icon: <Star className="h-5 w-5 text-amber-500" />,
      description:
        "Identify your core competencies, skills, and abilities that set you apart.",
      fields: [
        {
          id: "strengths",
          label: "Your Strengths",
          type: "tags",
          placeholder: "Enter your strengths separated by commas",
          helpText:
            "List the qualities, skills, and attributes that you excel at",
          required: true,
          exampleText:
            "E.g., Leadership, Problem-solving, Communication skills, Adaptability",
        },
      ],
    },
    {
      id: "weaknesses",
      title: "Weaknesses",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      description:
        "Acknowledge areas where you could improve or develop further.",
      fields: [
        {
          id: "weaknesses",
          label: "Your Weaknesses",
          type: "tags",
          placeholder: "Enter your weaknesses separated by commas",
          helpText: "Be honest about areas where you need to improve",
          required: true,
          exampleText:
            "E.g., Public speaking, Time management, Technical skills, Delegation",
        },
      ],
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      description:
        "External factors that you could leverage for career advancement.",
      fields: [
        {
          id: "opportunities",
          label: "Your Opportunities",
          type: "tags",
          placeholder: "Enter your opportunities separated by commas",
          helpText:
            "Consider industry trends, market needs, and potential openings",
          required: true,
          exampleText:
            "E.g., Industry growth, Networking events, Professional training, Mentorship",
        },
      ],
    },
    {
      id: "threats",
      title: "Threats",
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      description:
        "External challenges that might hinder your career progression.",
      fields: [
        {
          id: "threats",
          label: "Your Threats",
          type: "tags",
          placeholder: "Enter threats or challenges separated by commas",
          helpText: "Consider market conditions, competition, and obstacles",
          required: true,
          exampleText:
            "E.g., Industry disruption, Strong competition, Skill obsolescence, Economic factors",
        },
      ],
    },
    {
      id: "achievements",
      title: "Achievements",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      description: "Highlight your significant accomplishments and successes.",
      fields: [
        {
          id: "achievements",
          label: "Your Achievements",
          type: "tags",
          placeholder: "Enter your achievements separated by commas",
          helpText:
            "Include awards, recognitions, projects, and notable successes",
          required: true,
          exampleText:
            "E.g., Project X completion, Award Y recipient, Increased efficiency by Z%",
        },
      ],
    },
    {
      id: "aspirations",
      title: "Aspirations",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      description: "Define your life goals across different dimensions.",
      fields: [
        {
          id: "familyAspirations",
          label: "Family Aspirations",
          type: "textarea",
          placeholder:
            "Describe your aspirations related to family and personal life",
          helpText:
            "Consider your goals for family, relationships, personal development",
          required: true,
        },
        {
          id: "careerAspirations",
          label: "Career Aspirations",
          type: "textarea",
          placeholder: "Describe your long-term career goals and vision",
          helpText:
            "Consider where you want to be professionally in 5-10 years",
          required: true,
        },
        {
          id: "financialBusinessAspirations",
          label: "Financial/Business Aspirations",
          type: "textarea",
          placeholder: "Describe your financial goals and business ambitions",
          helpText: "Consider income targets, business ventures, investments",
          required: true,
        },
        {
          id: "socialAspirations",
          label: "Social Aspirations",
          type: "textarea",
          placeholder:
            "Describe your goals related to community and social impact",
          helpText:
            "Consider how you want to contribute to society and community",
          required: true,
        },
      ],
    },
    {
      id: "career",
      title: "Career Planning",
      icon: <Briefcase className="h-5 w-5 text-indigo-500" />,
      description: "Plan your career development path and strategies.",
      fields: [
        {
          id: "desiredPosition",
          label: "Desired Positions",
          type: "tags",
          placeholder: "Enter desired job positions separated by commas",
          helpText: "List specific roles or positions you aspire to hold",
          required: true,
          exampleText:
            "E.g., Senior Manager, Project Lead, Department Director",
        },
        {
          id: "requiredSkills",
          label: "Required Skills",
          type: "tags",
          placeholder: "Enter skills needed for desired positions",
          helpText:
            "List skills and qualifications you need to acquire or strengthen",
          required: true,
          exampleText:
            "E.g., Project management, Data analysis, Team leadership",
        },
        {
          id: "coursesAndTrainings",
          label: "Courses and Trainings",
          type: "tags",
          placeholder: "Enter relevant courses or certifications",
          helpText:
            "List training programs, certifications, or education you plan to pursue",
          required: true,
          exampleText: "E.g., MBA, PMP Certification, Leadership training",
        },
      ],
    },
    {
      id: "strategies",
      title: "Strategies & Goals",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      description: "Define your action plans and short-term objectives.",
      fields: [
        {
          id: "strategies",
          label: "Strategies",
          type: "tags",
          placeholder: "Enter your strategies separated by commas",
          helpText: "List approaches to achieve your aspirations and goals",
          required: true,
          exampleText:
            "E.g., Build network in target industry, Develop specialized expertise",
        },
        {
          id: "shortTermGoals",
          label: "Short-term Goals",
          type: "tags",
          placeholder: "Enter your short-term goals separated by commas",
          helpText:
            "List objectives you aim to achieve within the next 1-2 years",
          required: true,
          exampleText:
            "E.g., Obtain certification X, Take leadership role in project Y",
        },
      ],
    },
  ];

  // Function to render form field based on type
  const renderFormField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      value: formData[field.id] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleInputChange(field.id, e.target.value),
      required: field.required,
      className: formErrors[field.id] ? "border-red-500" : "",
    };

    switch (field.type) {
      case "textarea":
        return <Textarea {...commonProps} rows={5} />;
      case "tags":
      case "text":
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger
            value="questionnaire"
            disabled={!isVideoWatched}
            title={!isVideoWatched ? "Watch the introduction video first" : ""}
          >
            Questionnaire
          </TabsTrigger>
        </TabsList>

        {/* Introduction Tab */}
        <TabsContent value="introduction" className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Personal Discovery</h1>
            <Button variant="outline" asChild>
              <Link href="/dashboard/personal-discovery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                Introduction to Personal Discovery
              </CardTitle>
              <CardDescription>
                Watch this video to understand the 4W Framework and the personal
                discovery process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <YouTubePlayer
                  videoUrl="https://www.youtube.com/watch?v=an3DR_wv5w8"
                  onComplete={handleVideoComplete}
                />
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                    {isVideoWatched ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {isVideoWatched
                      ? "Video completed"
                      : "Required to continue"}
                  </span>
                </div>

                <Button
                  disabled={!isVideoWatched}
                  onClick={() => setActiveTab("questionnaire")}
                >
                  Continue to Questionnaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What is Personal Discovery?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Personal Discovery questionnaire is a self-assessment tool
                based on the 4W Framework developed by Abel Wilson Walekhwa. It
                helps you identify your strengths, weaknesses, opportunities,
                and threats, along with your aspirations and goals.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Benefits of Personal Discovery
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span>
                        Align your career goals with your personal aspirations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span>Identify areas for professional development</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span>
                        Develop strategic plans for career advancement
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span>
                        Create targeted goals that align with your strengths
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    How It Works
                  </h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        1
                      </div>
                      <span>Complete the Personal Discovery questionnaire</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        2
                      </div>
                      <span>
                        Receive a comprehensive analysis of your responses
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        3
                      </div>
                      <span>Use this to inform your CV alignment process</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        4
                      </div>
                      <span>
                        Discuss with a mentor to refine your career strategy
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                disabled={!isVideoWatched}
                onClick={() => setActiveTab("questionnaire")}
                className="w-full"
              >
                Start Questionnaire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Questionnaire Tab */}
        <TabsContent value="questionnaire">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                Personal Discovery Questionnaire
              </h1>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveProgress}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
            </div>

            {/* Progress indicator */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Completion Progress
                  </span>
                  <span className="text-sm">{calculateProgress()}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </CardContent>
            </Card>

            {/* Optional document upload */}
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-blue-500" />
                  Upload Personal Discovery Document (Optional)
                </CardTitle>
                <CardDescription>
                  If you already have a personal discovery document, you can
                  upload it instead of filling out the form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="file"
                  id="file"
                  accept=".doc,.docx,.pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Supported formats: Word (.doc, .docx), PDF (.pdf)
                </p>
              </CardContent>
            </Card>

            {/* Questionnaire sections */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Section navigation sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-muted rounded-lg p-4 sticky top-4">
                  <h2 className="text-lg font-medium mb-4">Sections</h2>
                  <div className="space-y-1">
                    {formSections.map((section) => (
                      <Button
                        key={section.id}
                        type="button"
                        variant={
                          activeSection === section.id ? "default" : "ghost"
                        }
                        className={`w-full justify-start ${
                          activeSection === section.id ? "bg-primary" : ""
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        {section.icon}
                        <span className="ml-2">{section.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active section form */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {formSections.map(
                    (section) =>
                      section.id === activeSection && (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                {section.icon}
                                <span className="ml-2">{section.title}</span>
                              </CardTitle>
                              <CardDescription>
                                {section.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {section.fields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                  <div className="flex justify-between">
                                    <label
                                      htmlFor={field.id}
                                      className="block text-sm font-medium"
                                    >
                                      {field.label}
                                      {field.required && (
                                        <span className="text-red-500 ml-1">
                                          *
                                        </span>
                                      )}
                                    </label>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                          >
                                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs">
                                            {field.helpText}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>

                                  {renderFormField(field)}

                                  {field.exampleText && (
                                    <p className="text-xs text-muted-foreground">
                                      {field.exampleText}
                                    </p>
                                  )}

                                  {formErrors[field.id] && (
                                    <p className="text-xs text-red-500">
                                      {formErrors[field.id]}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const currentIndex = formSections.findIndex(
                                    (s) => s.id === activeSection
                                  );
                                  if (currentIndex > 0) {
                                    setActiveSection(
                                      formSections[currentIndex - 1].id
                                    );
                                  }
                                }}
                                disabled={formSections[0].id === activeSection}
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Previous
                              </Button>

                              <Button
                                type="button"
                                onClick={() => {
                                  const currentIndex = formSections.findIndex(
                                    (s) => s.id === activeSection
                                  );
                                  if (currentIndex < formSections.length - 1) {
                                    setActiveSection(
                                      formSections[currentIndex + 1].id
                                    );
                                  }
                                }}
                                disabled={
                                  formSections[formSections.length - 1].id ===
                                  activeSection
                                }
                              >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Submit Your Personal Discovery</CardTitle>
                <CardDescription>
                  Review your answers before submitting to ensure accuracy
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/personal-discovery">Cancel</Link>
                </Button>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveProgress}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Submit Personal Discovery
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
