"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
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
import { 
  LockIcon, 
  MailIcon, 
  EyeIcon, 
  EyeOffIcon,
  UserIcon,
  LogInIcon,
  ArrowRightIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Welcome back to your mentorship journey.",
      });
      
      const callBackUrl = decodeURIComponent(params.get("callbackUrl") || "");
      if (session?.user?.role === "ADMIN") {
        router.push("/admin/");
      } else {
        router.push(callBackUrl || "/dashboard");
      }
    }
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
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
              <UserIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl text-center font-bold text-gray-900 dark:text-gray-100">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center pt-1 text-gray-600 dark:text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-muted-foreground font-medium">
                        <LockIcon className="h-3.5 w-3.5" />
                        Password
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-end"
              >
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  className={cn(
                    "w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full py-3 h-auto transition-all",
                    isLoading && "opacity-80"
                  )} 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogInIcon className="h-4 w-4" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        
        <motion.div variants={itemVariants}>
          <Separator className="w-full opacity-50" />
        </motion.div>
        
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <motion.p 
            variants={itemVariants}
            className="text-center text-sm text-muted-foreground w-full"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center"
            >
              Sign up
              <ArrowRightIcon className="h-3 w-3 ml-1" />
            </Link>
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="w-full"
          >
            <Button 
              variant="ghost" 
              className="w-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-full py-3 h-auto transition-all"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </motion.div>
        </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}