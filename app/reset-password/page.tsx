"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  KeyIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  ArrowLeft, 
  ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }).regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    }).regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    }).regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPasswordMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;

    resetPasswordMutation.mutate({
      password: values.password,
      token,
    });
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Invalid token view
  if (!token) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/50 border-blue-100 dark:border-blue-900/50 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500 w-full"></div>
          
          <CardHeader className="space-y-2">
            <motion.div 
              variants={itemVariants} 
              className="flex justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl text-center font-bold">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-center pt-1">
                The password reset link is invalid or has expired
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border border-red-100 dark:border-red-900/30 text-center">
                <p className="text-muted-foreground">
                  For security reasons, password reset links are valid for 24 hours. 
                  Please request a new link to reset your password.
                </p>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
              >
                <Link href="/forgot-password">Request New Reset Link</Link>
              </Button>
            </motion.div>
          </CardContent>
          
          <motion.div variants={itemVariants}>
            <Separator className="w-full opacity-50" />
          </motion.div>
          
          <CardFooter className="flex justify-center pt-4">
            <motion.div variants={itemVariants}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                asChild
              >
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Login</span>
                </Link>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  // Valid token view with reset form or success message
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/50 border-blue-100 dark:border-blue-900/50 shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-teal-500 w-full"></div>
        
        <CardHeader className="space-y-2">
          <motion.div 
            variants={itemVariants} 
            className="flex justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                {resetPasswordMutation.isSuccess ? (
                  <ShieldCheck className="h-6 w-6 text-gradient-primary" />
                ) : (
                  <KeyIcon className="h-6 w-6 text-gradient-primary" />
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              {resetPasswordMutation.isSuccess ? "Password Reset Complete" : "Create New Password"}
            </CardTitle>
            <CardDescription className="text-center pt-1">
              {resetPasswordMutation.isSuccess ? 
                "Your password has been successfully updated" : 
                "Enter a strong password to secure your account"}
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <motion.div 
            variants={containerVariants}
            key={resetPasswordMutation.isSuccess ? "success" : "form"}
            initial="hidden"
            animate="visible"
          >
            {resetPasswordMutation.isSuccess ? (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-100 dark:border-green-900/50 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Your password has been reset</h3>
                    <p className="text-muted-foreground text-sm">
                      You can now log in to your account using your new password.
                    </p>
                  </div>
                </div>
                
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                            <LockIcon className="h-3.5 w-3.5" />
                            New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
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
                            Password must be at least 8 characters with upper and lowercase letters and numbers.
                          </FormDescription>
                          <FormMessage />
                          
                          {/* Password strength indicators */}
                          <div className="mt-4 space-y-2">
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
                                    <CheckCircle2 className="h-3 w-3" />
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
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                            <LockIcon className="h-3.5 w-3.5" />
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                {...field} 
                                className="bg-white dark:bg-gray-900 pl-10 pr-10"
                              />
                              <LockIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOffIcon className="h-4 w-4" />
                                ) : (
                                  <EyeIcon className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Button 
                      className={cn(
                        "w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition-all",
                        resetPasswordMutation.isPending && "opacity-80"
                      )} 
                      type="submit" 
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating Password...</span>
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            )}
          </motion.div>
        </CardContent>
        
        <motion.div variants={itemVariants}>
          <Separator className="w-full opacity-50" />
        </motion.div>
        
        <CardFooter className="flex justify-center pt-4">
          <motion.div variants={itemVariants}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
              asChild
            >
              <Link href="/login">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}