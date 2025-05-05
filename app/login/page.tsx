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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/50 border-blue-100 dark:border-blue-900/50 shadow-xl">
        <CardHeader className="space-y-2">
          <motion.div 
            variants={itemVariants} 
            className="flex justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gradient-primary" />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center pt-1">
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
                    "w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition-all",
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
              variant="outline" 
              className="w-full border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-muted-foreground"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}