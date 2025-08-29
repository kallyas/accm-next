"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { getNames } from "country-list";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  GlobeIcon, 
  BookIcon, 
  LockIcon,
  UserPlusIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  ArrowLeftIcon,
  BriefcaseIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  service: z.string({
    required_error: "Please select a service.",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Please select a gender.",
  }),
  country: z.string({
    required_error: "Please select a country.",
  }),
  educationLevel: z.string({
    required_error: "Please select an education level.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  }).regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  }).regex(/[0-9]/, {
    message: "Password must contain at least one number.",
  }),
});

// Multi-step form sections
const STEPS = [
  { name: "Personal Information", fields: ["firstName", "lastName", "email", "phone"] },
  { name: "Additional Details", fields: ["service", "gender", "country", "educationLevel"] },
  { name: "Security", fields: ["password"] },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      gender: undefined,
      country: "",
      educationLevel: "",
      password: "",
    },
    mode: "onChange",
  });

  // Update progress bar based on form completion
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const totalFields = Object.keys(formSchema.shape).length;
      const filledFields = Object.values(value).filter(val => val !== undefined && val !== "").length;
      setProgressPercent(Math.floor((filledFields / totalFields) * 100));
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Form step navigation
  const nextStep = async () => {
    const currentFields = STEPS[currentStep].fields;
    
    // Validate current step fields
    const isValid = await form.trigger(currentFields as any, { shouldFocus: true });
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    const currentFields = STEPS[currentStep].fields;
    const fieldStates = currentFields.map(field => {
      const state = form.getFieldState(field as any);
      return !state.invalid;
    });
    
    return fieldStates.every(Boolean) && currentFields.every(field => {
      const value = form.getValues(field as any);
      return value !== undefined && value !== "";
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast({
        title: "Registration Failed",
        description: "Your registration request failed. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      title: "Registration Successful!",
      description: "Your account has been created. You can now log in.",
    });

    router.push("/login");
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Step indicators for progress display
  const stepIndicators = (
    <div className="flex justify-between items-center mb-8 w-full">
      {STEPS.map((step, index) => (
        <div 
          key={index} 
          className={cn(
            "flex flex-col items-center relative",
            index < currentStep ? "text-blue-600 dark:text-blue-400" : 
            index === currentStep ? "text-teal-600 dark:text-teal-400" : 
            "text-gray-400 dark:text-gray-500"
          )}
        >
          <div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-all",
              index < currentStep ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600" : 
              index === currentStep ? "bg-teal-100 dark:bg-teal-900/30 border-teal-500 dark:border-teal-600" : 
              "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            )}
          >
            {index < currentStep ? (
              <CheckIcon className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <span className="text-xs text-center max-w-[80px]">{step.name}</span>
          
          {/* Connector line */}
          {index < STEPS.length - 1 && (
            <div 
              className={cn(
                "absolute top-5 left-[calc(100%+0.5rem)] w-[calc(100%-1.5rem)] h-0.5",
                index < currentStep ? "bg-blue-500 dark:bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              )}
              style={{ left: "calc(50% + 1rem)", width: "calc(100% - 2rem)" }}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl">
          <CardHeader className="space-y-2">
            <motion.div 
              variants={itemVariants} 
              className="flex justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <UserPlusIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl text-center font-bold text-gray-900 dark:text-gray-100">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-center pt-1 text-gray-600 dark:text-gray-400">
                Join our community and start your mentorship journey
              </CardDescription>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-2">
              {stepIndicators}
              
              <div className="w-full">
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {progressPercent}% complete
                </p>
              </div>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <UserIcon className="h-3.5 w-3.5" />
                                First Name
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="Enter your first name" 
                                    {...field} 
                                    className="bg-white dark:bg-gray-900 pl-10"
                                  />
                                  <UserIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <UserIcon className="h-3.5 w-3.5" />
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="Enter your last name" 
                                    {...field} 
                                    className="bg-white dark:bg-gray-900 pl-10"
                                  />
                                  <UserIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <MailIcon className="h-3.5 w-3.5" />
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="your.email@example.com" 
                                    {...field} 
                                    className="bg-white dark:bg-gray-900 pl-10"
                                  />
                                  <MailIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <PhoneIcon className="h-3.5 w-3.5" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="+1234567890" 
                                    {...field} 
                                    className="bg-white dark:bg-gray-900 pl-10"
                                  />
                                  <PhoneIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 2: Additional Details */}
                {currentStep === 1 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="service"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <BriefcaseIcon className="h-3.5 w-3.5" />
                                Service Interest
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white dark:bg-gray-900">
                                    <SelectValue placeholder="Select a service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="mentorship">Mentorship</SelectItem>
                                  <SelectItem value="career_coaching">Career Coaching</SelectItem>
                                  <SelectItem value="resume_review">Resume Review</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-xs">
                                Choose the service you're most interested in
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <UserIcon className="h-3.5 w-3.5" />
                                Gender
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white dark:bg-gray-900">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="MALE">Male</SelectItem>
                                  <SelectItem value="FEMALE">Female</SelectItem>
                                  <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <GlobeIcon className="h-3.5 w-3.5" />
                                Country
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white dark:bg-gray-900">
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[200px]">
                                  {getNames().map((country) => (
                                    <SelectItem key={country} value={country}>
                                      {country}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="educationLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <BookIcon className="h-3.5 w-3.5" />
                                Education Level
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white dark:bg-gray-900">
                                    <SelectValue placeholder="Select education level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="high_school">High School</SelectItem>
                                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                                  <SelectItem value="masters">Master's Degree</SelectItem>
                                  <SelectItem value="phd">PhD</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 3: Security */}
                {currentStep === 2 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                              <LockIcon className="h-3.5 w-3.5" />
                              Create Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Create a secure password" 
                                  {...field} 
                                  className="bg-white dark:bg-gray-900 pl-10 pr-10"
                                />
                                <LockIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOffIcon className="h-4 w-4" />
                                  ) : (
                                    <EyeIcon className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs">
                              Password must be at least 8 characters with a mix of upper and lowercase letters and numbers.
                            </FormDescription>
                            <FormMessage />
                            
                            {/* Password strength indicators */}
                            <div className="mt-4 space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">Password requirements:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { test: /.{8,}/, label: "At least 8 characters" },
                                  { test: /[A-Z]/, label: "Uppercase letter" },
                                  { test: /[a-z]/, label: "Lowercase letter" },
                                  { test: /[0-9]/, label: "Number" }
                                ].map((requirement, index) => (
                                  <div 
                                    key={index} 
                                    className={cn(
                                      "text-xs flex items-center gap-1.5 px-2 py-1 rounded",
                                      field.value && requirement.test.test(field.value) 
                                        ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20" 
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {field.value && requirement.test.test(field.value) ? (
                                      <CheckIcon className="h-3 w-3" />
                                    ) : (
                                      <div className="h-3 w-3 rounded-full border border-current" />
                                    )}
                                    <span>{requirement.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </motion.div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-6">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-blue-200 dark:border-blue-900/50"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  )}
                  
                  {currentStep < STEPS.length - 1 && (
                    <Button
                      type="button"
                      className={cn(
                        "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6 ml-auto",
                        !isCurrentStepValid() && "opacity-70"
                      )}
                      onClick={nextStep}
                      disabled={!isCurrentStepValid()}
                    >
                      Continue
                    </Button>
                  )}
                  
                  {currentStep === STEPS.length - 1 && (
                    <Button
                      type="submit"
                      className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6 ml-auto"
                      disabled={isLoading || !isCurrentStepValid()}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          
          <Separator className="w-full opacity-50" />
          
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <motion.p 
              variants={itemVariants}
              className="text-center text-xs text-muted-foreground w-full"
            >
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-center text-sm text-muted-foreground w-full"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Log in
              </Link>
            </motion.p>
          </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}