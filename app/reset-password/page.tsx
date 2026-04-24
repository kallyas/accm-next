"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  XCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);

    toast({
      title: "Password reset",
      description: "You can now log in with your new password.",
    });
  };

  if (!token) {
    return (
      <div className="bg-white text-[#1A1B4B]">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-red-500/20 bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold uppercase">
                Invalid Reset Link
              </h1>
              <p className="mt-2 text-sm text-[#1A1B4B]/60">
                The password reset link is invalid or has expired.
              </p>
            </div>
            <Button asChild className="w-full rounded-none bg-[#1A1B4B] text-white">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
            <p className="text-sm text-[#1A1B4B]/70">
              <Link
                href="/login"
                className="font-semibold uppercase tracking-wider text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#1A1B4B]">
      <div className="min-h-screen flex">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex lg:w-[55%] relative bg-[#1A1B4B] p-10 flex-col justify-center items-center"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#26A649]/20 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 text-center max-w-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#26A649]/30 bg-[#26A649]/10">
                  <ShieldCheck className="h-8 w-8 text-[#26A649]" />
                </div>
                <h2 className="text-2xl font-semibold uppercase tracking-tight text-white">
                  Password Reset
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  Your password has been successfully updated.
                </p>
                <p className="mt-6 text-xs leading-5 text-white/50">
                  You can now sign in with your new password.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:flex lg:w-[55%] relative flex-col justify-center p-10 lg:p-20 bg-[#ece8df]"
            >
              <div className="max-w-lg mx-auto space-y-8">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#1A1B4B]/50">
                    <Lock className="mr-2 h-3.5 w-3.5 inline" />
                    Account security
                  </p>
                  <h1 className="mt-4 text-balance text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.98] text-[#1A1B4B]">
                    Create new password.
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-[#1A1B4B]/70">
                    Your new password must be different from previously used passwords.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { test: /.{8,}/, label: "At least 8 characters" },
                    { test: /[A-Z]/, label: "One uppercase letter" },
                    { test: /[a-z]/, label: "One lowercase letter" },
                    { test: /[0-9]/, label: "One number" },
                  ].map((req, index) => (
                    <div
                      key={req.label}
                      className={`flex items-center gap-3 border border-[#1A1B4B]/20 bg-white/70 p-3 ${
                        index === 1 ? "sm:translate-y-2" : ""
                      }`}
                    >
                      <div className="h-2 w-2 bg-[#1A1B4B]/30" />
                      <span className="text-xs uppercase tracking-wider text-[#1A1B4B]/60">
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex items-center justify-center p-8 lg:p-20">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-left">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-semibold uppercase tracking-wider"
              >
                <Sparkles className="h-5 w-5" />
                ACCM
              </Link>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-mobile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="border border-[#26A649]/20 bg-[#26A649]/5 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-[#26A649]/20 bg-[#26A649]/10">
                      <ShieldCheck className="h-6 w-6 text-[#26A649]" />
                    </div>
                    <h2 className="text-lg font-semibold uppercase">
                      Password Reset
                    </h2>
                    <p className="mt-2 text-sm text-[#1A1B4B]/60">
                      Your password has been updated.
                    </p>
                    <Button
                      asChild
                      className="mt-6 w-full rounded-none bg-[#1A1B4B] text-white"
                    >
                      <Link href="/login">Go to Login</Link>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                              New password
                            </FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  {...field}
                                  className="h-11 rounded-none border-[#1A1B4B]/20 bg-white pr-10"
                                />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1B4B]/40"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                              Confirm password
                            </FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  {...field}
                                  className="h-11 rounded-none border-[#1A1B4B]/20 bg-white pr-10"
                                />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1B4B]/40"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 w-full rounded-none bg-[#1A1B4B] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#1A1B4B]/90"
                      >
                        {isSubmitting ? "Updating..." : "Reset password"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-[#1A1B4B]/70">
              <Link
                href="/login"
                className="font-semibold uppercase tracking-wider text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}