"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, MailIcon, ArrowLeft, KeyIcon, MailCheck, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPasswordPage() {
  const { forgotPasswordMutation } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => {
        setEmailSent(true);
      }
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
                <KeyIcon className="h-6 w-6 text-gradient-primary" />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              {emailSent ? "Check Your Email" : "Reset Your Password"}
            </CardTitle>
            <CardDescription className="text-center pt-1">
              {emailSent 
                ? "We've sent you instructions to reset your password" 
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <motion.div 
            variants={containerVariants}
            key={emailSent ? "success" : "form"}
            initial="hidden"
            animate="visible"
          >
            {emailSent ? (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <MailCheck className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <h3 className="font-medium">Email sent to {form.getValues().email}</h3>
                    <p className="text-muted-foreground text-sm">
                      Please check your inbox and follow the instructions to reset your password. 
                      The link will expire in 24 hours.
                    </p>
                    
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">
                        Didn't receive an email? Check your spam folder or
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 dark:text-blue-400"
                        onClick={() => {
                          setEmailSent(false);
                          form.reset();
                        }}
                      >
                        try another email address
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-center text-muted-foreground">
                    If you're still having trouble, please contact our
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-blue-200 dark:border-blue-900/50"
                      asChild
                    >
                      <Link href="/contact">support team</Link>
                    </Button>
                  </div>
                </div>
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
                          <FormDescription className="text-xs">
                            We'll send a password reset link to this email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Button 
                      className={cn(
                        "w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition-all",
                        forgotPasswordMutation.isPending && "opacity-80"
                      )} 
                      type="submit" 
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send Reset Link"
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